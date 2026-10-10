type PlatformCase = { id: string; client: string; owners: string[]; dueDate?: string; alertDate?: string; alertDismissedKey?: string; alertMessage?: string; deadlineLabel?: string; history: Record<string, unknown>[] };
type PlatformTask = { id: string; caseId: string; title: string; owner: string; priority: 'Alta' | 'Media' | 'Baja'; dueDate: string; dueTime?: string; done: boolean; createdAt: string; createdAtIso?: string; completedBy?: string; source?: string };
type PlatformAlert = { id: string; caseId: string; title: string; date: string; time?: string; url?: string; owner: string; createdAt: string; createdAtIso?: string; done?: boolean; completedBy?: string; source?: string };
type Snapshot = { cases: PlatformCase[]; tasks: PlatformTask[]; alerts: PlatformAlert[]; [key: string]: unknown };
type TelegramMessage = { message_id: number; chat: { id: number }; from?: { id: number; first_name?: string; last_name?: string; is_bot?: boolean }; text?: string; reply_to_message?: { message_id: number; text?: string; from?: { is_bot?: boolean } } };
type TelegramUpdate = { update_id: number; message?: TelegramMessage };
type Delivery = { target_kind: 'case' | 'task' | 'alert'; target_id: string };
class CommandError extends Error {}
type Draft = { kind: 'tarea' | 'alerta'; step: 'case' | 'title' | 'date' | 'time' | 'url' | 'confirm'; data: { caseId?: string; title?: string; date?: string; time?: string; url?: string } };

const baseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const injectedKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}') as Record<string, string>;
const serviceKey = injectedKeys.default ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '';
const groupId = Number(Deno.env.get('TELEGRAM_GROUP_CHAT_ID'));
const webhookSecret = Deno.env.get('TELEGRAM_WEBHOOK_SECRET') ?? '';

function actorName(message: TelegramMessage): string {
  const firstName = message.from?.first_name?.trim() ?? '';
  if (/\bjuan\b/i.test(firstName)) return 'Juan Valencia';
  if (/\bluis\b/i.test(firstName)) return 'Luis Hernando Barrios';
  return [firstName, message.from?.last_name?.trim()].filter(Boolean).join(' ') || `Telegram ${message.from?.id}`;
}

async function database(path: string, init: RequestInit = {}) {
  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      ...(serviceKey.split('.').length === 3 ? { Authorization: `Bearer ${serviceKey}` } : {}),
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}

async function reply(message: TelegramMessage, text: string, mode?: 'menu' | 'prompt') {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: groupId, text, reply_parameters: { message_id: message.message_id, allow_sending_without_reply: true }, ...(mode === 'menu' ? { reply_markup: { keyboard: [[{ text: '/crear_tarea' }, { text: '/crear_alerta' }], [{ text: '/cancelar' }]], resize_keyboard: true, one_time_keyboard: true, selective: true } } : mode === 'prompt' ? { reply_markup: { force_reply: true, selective: true, input_field_placeholder: 'Escribe tu respuesta aquí' } } : {}) }),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(`Telegram ${response.status}: ${result.description ?? 'No se pudo enviar la respuesta'}`);
}

function replyMode(text: string): 'menu' | 'prompt' | undefined {
  if (text.startsWith('Elige una opción:')) return 'menu';
  if (/^(Vamos a crear|Expediente:|¿Qué fecha|¿A qué hora|¿Hay un enlace|Confirma la |No encontré ese expediente|Encontré varios|Escribe una descripción|La fecha no|Hora no válida|El enlace debe|Responde Confirmar)/.test(text)) return 'prompt';
  return undefined;
}

async function mutate(change: (data: Snapshot) => { data: Snapshot; response: string }): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const rows = await database('platform_state?select=revision,data&id=eq.1');
    const row = rows?.[0];
    if (!row) throw new Error('Platform state missing');
    const revision = Number(row.revision);
    const result = change(row.data as Snapshot);
    const saved = await database(`platform_state?id=eq.1&revision=eq.${revision}&select=revision`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ data: result.data, revision: revision + 1, updated_at: new Date().toISOString() }),
    });
    if (saved?.length) return result.response;
  }
  throw new Error('Could not save simultaneous changes');
}

function auditEntry(actor: string, action: string, detail: string, telegramUserId?: number) {
  return { at: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }), timestamp: Date.now(), by: actor, telegramUserId, action, detail };
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.toISOString().slice(0, 10) === value;
}

function parseCreate(text: string) {
  const parts = text.split('|').map((part) => part.trim());
  if (parts.length < 3 || parts.length > 4 || !parts[0] || !parts[1] || !validDate(parts[2]) || (parts[3] && !/^([01]\d|2[0-3]):[0-5]\d$/.test(parts[3]))) return null;
  return { caseId: parts[0], title: parts[1], date: parts[2], time: parts[3] || '' };
}

function validUrl(value: string): boolean {
  try { return new URL(value).protocol === 'https:'; }
  catch { return false; }
}

function draftPath(userId: number): string {
  return `telegram_chat_drafts?chat_id=eq.${groupId}&user_id=eq.${userId}`;
}

async function getDraft(userId: number): Promise<Draft | null> {
  const rows = await database(`${draftPath(userId)}&select=kind,step,data`);
  return rows?.[0] ?? null;
}

async function saveDraft(userId: number, draft: Draft): Promise<void> {
  await database('telegram_chat_drafts?on_conflict=chat_id,user_id', {
    method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ chat_id: groupId, user_id: userId, ...draft, updated_at: new Date().toISOString() }),
  });
}

async function clearDraft(userId: number): Promise<void> {
  await database(draftPath(userId), { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
}

async function deliveryFor(message: TelegramMessage, directId: string): Promise<Delivery | null> {
  if (message.reply_to_message?.message_id) {
    const rows = await database(`telegram_group_reminder_deliveries?select=target_kind,target_id&message_id=eq.${message.reply_to_message.message_id}&order=sent_at.desc&limit=1`);
    if (rows?.[0]) return rows[0];
    const confirmation = message.reply_to_message;
    const createdId = confirmation.from?.is_bot && confirmation.text?.match(/C[oó]digo:\s*([TA]-[\w-]+)/i)?.[1];
    if (createdId) return { target_kind: createdId.startsWith('T-') ? 'task' : 'alert', target_id: createdId };
  }
  if (/^[TA]-[\w-]+$/.test(directId)) return { target_kind: directId.startsWith('T-') ? 'task' : 'alert', target_id: directId };
  return null;
}

async function createItem(kind: 'tarea' | 'alerta', draft: { caseId: string; title: string; date: string; time: string; url?: string }, message: TelegramMessage, actor: string): Promise<string> {
  return mutate((data) => {
    const item = data.cases.find((entry) => entry.id.toLowerCase() === draft.caseId.toLowerCase());
    if (!item) throw new CommandError(`No encontré el expediente ${draft.caseId}. Revisa su número BV.`);
    const id = `${kind === 'tarea' ? 'T' : 'A'}-${crypto.randomUUID()}`;
    const createdAt = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });
    const createdAtIso = new Date().toISOString();
    if (kind === 'tarea') data.tasks = [{ id, title: draft.title, caseId: item.id, owner: actor, priority: 'Media', dueDate: draft.date, dueTime: draft.time, done: false, createdAt, createdAtIso, source: 'telegram' }, ...data.tasks];
    else data.alerts = [{ id, title: draft.title, caseId: item.id, owner: actor, date: draft.date, time: draft.time, url: draft.url, createdAt, createdAtIso, source: 'telegram' }, ...data.alerts];
    data.cases = data.cases.map((entry) => entry.id === item.id ? { ...entry, history: [auditEntry(actor, kind === 'tarea' ? 'Creó tarea desde Telegram' : 'Creó alerta desde Telegram', `${draft.title} · ${draft.date}${draft.time ? ` ${draft.time}` : ''}${draft.url ? ` · ${draft.url}` : ''}`, message.from?.id), ...(entry.history ?? [])] } : entry);
    return { data, response: `Creé ${kind === 'tarea' ? 'la tarea' : 'la alerta'} para ${item.client}: ${draft.title} · ${draft.date}${draft.time ? ` a las ${draft.time}` : ''}.\nCódigo: ${id}` };
  });
}

async function handleDraft(message: TelegramMessage, actor: string, draft: Draft, text: string): Promise<string> {
  const userId = message.from!.id;
  if (draft.step === 'case') {
    const rows = await database('platform_state?select=data&id=eq.1');
    const cases = (rows?.[0]?.data?.cases ?? []) as PlatformCase[];
    const query = text.toLocaleLowerCase().trim();
    const exact = cases.find((item) => item.id.toLocaleLowerCase() === query);
    const matches = exact ? [exact] : cases.filter((item) => item.client.toLocaleLowerCase().includes(query));
    if (matches.length !== 1) return matches.length > 1 ? `Encontré varios: ${matches.slice(0, 8).map((item) => `${item.id} (${item.client})`).join(', ')}. Responde con el código BV.` : 'No encontré ese expediente. Responde con el código BV o parte del nombre del cliente.';
    draft.data.caseId = matches[0].id;
    draft.step = 'title';
    await saveDraft(userId, draft);
    return `Expediente: ${matches[0].client} (${matches[0].id}).\nAhora responde con la descripción de ${draft.kind === 'tarea' ? 'la tarea' : 'la alerta'}.`;
  }
  if (draft.step === 'title') {
    if (text.length < 3 || text.length > 500) return 'Escribe una descripción de 3 a 500 caracteres.';
    draft.data.title = text;
    draft.step = 'date';
    await saveDraft(userId, draft);
    return '¿Qué fecha tiene? Responde en formato AAAA-MM-DD, por ejemplo 2026-10-15.';
  }
  if (draft.step === 'date') {
    if (!validDate(text)) return 'La fecha no es válida. Usa AAAA-MM-DD, por ejemplo 2026-10-15.';
    draft.data.date = text;
    draft.step = 'time';
    await saveDraft(userId, draft);
    return '¿A qué hora? Responde HH:MM (hora de Bogotá) o escribe Omitir.';
  }
  if (draft.step === 'time') {
    if (!/^omitir$/i.test(text) && !/^([01]\d|2[0-3]):[0-5]\d$/.test(text)) return 'Hora no válida. Responde HH:MM o escribe Omitir.';
    draft.data.time = /^omitir$/i.test(text) ? '' : text;
    draft.step = draft.kind === 'alerta' ? 'url' : 'confirm';
    await saveDraft(userId, draft);
    return draft.kind === 'alerta' ? '¿Hay un enlace para la audiencia o reunión? Pega una dirección https:// o escribe Omitir.' : `Confirma la tarea: ${draft.data.title} · ${draft.data.caseId} · ${draft.data.date}${draft.data.time ? ` ${draft.data.time}` : ''}. Responde Confirmar o Cancelar.`;
  }
  if (draft.step === 'url') {
    if (!/^omitir$/i.test(text) && !validUrl(text)) return 'El enlace debe empezar por https://. Pégalo o escribe Omitir.';
    draft.data.url = /^omitir$/i.test(text) ? '' : text;
    draft.step = 'confirm';
    await saveDraft(userId, draft);
    return `Confirma la alerta: ${draft.data.title} · ${draft.data.caseId} · ${draft.data.date}${draft.data.time ? ` ${draft.data.time}` : ''}${draft.data.url ? ` · ${draft.data.url}` : ''}. Responde Confirmar o Cancelar.`;
  }
  if (!/^confirmar$/i.test(text)) return 'Responde Confirmar para guardarla o Cancelar para salir.';
  const created = await createItem(draft.kind, { caseId: draft.data.caseId!, title: draft.data.title!, date: draft.data.date!, time: draft.data.time ?? '', url: draft.data.url }, message, actor);
  await clearDraft(userId);
  return created;
}

async function handleCommand(message: TelegramMessage, actor: string): Promise<string | null> {
  const text = message.text?.trim() ?? '';
  if (/^(?:\/menu(?:@[\w]+)?|menu)$/i.test(text)) return 'Elige una opción: Crear tarea o Crear alerta. También puedes escribir /ayuda.';
  if (/^(?:\/cancelar(?:@[\w]+)?|cancelar)$/i.test(text)) {
    if (message.from) await clearDraft(message.from.id);
    return 'Listo, cancelé la creación.';
  }
  const start = text.match(/^(?:\/)?crear[\s_]+(tarea|alerta)(?:@[\w]+)?$/i);
  if (start) {
    if (!message.from) return null;
    const draft: Draft = { kind: start[1].toLowerCase() as Draft['kind'], step: 'case', data: {} };
    await saveDraft(message.from.id, draft);
    return `Vamos a crear una ${draft.kind}. Responde a este mensaje con el código BV del expediente o parte del nombre del cliente. Escribe Cancelar para salir.`;
  }
  const match = text.match(/^\/(tarea|alerta|hecho|ayuda)(?:@[\w]+)?(?:\s+([\s\S]*))?$/i);
  const naturalDone = /^(?:tarea realizada|alerta realizada|hecho|hecha)$/i.test(text) && message.reply_to_message;
  if (!match && !naturalDone) {
    const draft = message.from ? await getDraft(message.from.id) : null;
    return draft ? handleDraft(message, actor, draft, text) : null;
  }
  const command = naturalDone ? 'hecho' : match![1].toLowerCase();
  const argument = match?.[2]?.trim() ?? '';
  if (command === 'ayuda') return 'Escribe /menu para crear una tarea o alerta con preguntas.\nTambién puedes usar:\n/tarea BV-123 | Descripción | AAAA-MM-DD | HH:MM\n/alerta BV-123 | Descripción | AAAA-MM-DD | HH:MM\nPara detener avisos, responde a uno del bot con /hecho o “tarea realizada”. La hora es opcional.';
  if (command === 'hecho') {
    const target = await deliveryFor(message, argument);
    if (!target) return 'Responde directamente a un aviso del bot con /hecho para indicar cuál terminaste.';
    return mutate((data) => {
      const cases = [...data.cases];
      let updated = false;
      let caseId = '';
      let action = '';
      let detail = '';
      if (target.target_kind === 'task') {
        data.tasks = data.tasks.map((task) => {
          if (task.id !== target.target_id) return task;
          if (task.done) throw new CommandError('Esta tarea ya estaba completada.');
          updated = true; caseId = task.caseId;
          action = 'Completó tarea desde Telegram';
          detail = task.title;
          return { ...task, done: true, completedBy: actor };
        });
      } else if (target.target_kind === 'alert') {
        data.alerts = data.alerts.map((alert) => {
          if (alert.id !== target.target_id) return alert;
          if (alert.done) throw new CommandError('Esta alerta ya estaba completada.');
          updated = true; caseId = alert.caseId;
          action = 'Completó alerta desde Telegram';
          detail = alert.title;
          return { ...alert, done: true, completedBy: actor };
        });
      } else {
        caseId = target.target_id;
        data.cases = cases.map((item) => {
          if (item.id !== caseId) return item;
          const dismissedKey = `${item.dueDate || ''}|${item.alertDate || ''}`;
          if (item.alertDismissedKey === dismissedKey) throw new CommandError('Este aviso ya estaba cerrado.');
          updated = true;
          action = 'Cerró aviso del expediente desde Telegram';
          detail = item.alertMessage || item.deadlineLabel || 'Recordatorio del expediente';
          return { ...item, alertDismissedKey: dismissedKey };
        });
      }
      if (!updated) throw new CommandError('El aviso ya no existe. Busca uno más reciente.');
      data.cases = data.cases.map((item) => item.id === caseId ? { ...item, history: [auditEntry(actor, action, detail, message.from?.id), ...(item.history ?? [])] } : item);
      return { data, response: 'Listo. Marqué el aviso como realizado y detuve los próximos recordatorios de este pendiente.' };
    });
  }
  const draft = parseCreate(argument);
  if (!draft) return `Formato: /${command} BV-123 | Descripción | AAAA-MM-DD | HH:MM\nLa hora es opcional.`;
  return createItem(command as 'tarea' | 'alerta', draft, message, actor);
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  if (!webhookSecret || request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== webhookSecret) return new Response('Unauthorized', { status: 401 });
  if (!baseUrl || !serviceKey || !botToken || !Number.isSafeInteger(groupId) || groupId >= 0) return new Response('Missing server configuration', { status: 500 });
  const update = await request.json() as TelegramUpdate;
  const message = update.message;
  if (!message || message.chat.id !== groupId || !message.from || message.from.is_bot) return Response.json({ ok: true });
  const actor = actorName(message);
  let claimed = false;
  try {
    const rows = await database('telegram_processed_updates?on_conflict=update_id&select=update_id', {
      method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
      body: JSON.stringify({ update_id: update.update_id }),
    });
    claimed = Boolean(rows?.length);
    if (!claimed) return Response.json({ ok: true });
    const response = await handleCommand(message, actor);
    if (response) {
      try {
        await reply(message, response, replyMode(response));
      }
      catch (error) { console.error('Could not confirm Telegram command', error); }
    }
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof CommandError) {
      try { await reply(message, error.message); }
      catch (replyError) { console.error('Could not reply to invalid command', replyError); }
      return Response.json({ ok: true });
    }
    console.error('Telegram chat command failed', error);
    if (claimed) await database(`telegram_processed_updates?update_id=eq.${update.update_id}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
    return Response.json({ error: 'Could not process chat command' }, { status: 500 });
  }
});
