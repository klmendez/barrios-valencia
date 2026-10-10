type Case = { id: string; client: string; phone?: string; owners: string[]; status: string; alertDate?: string; alertMessage?: string; deadlineLabel?: string; dueDate?: string; dueTime?: string; alertTaskId?: string; alertDismissedKey?: string; history?: { timestamp?: number; action: string }[]; annotations?: { date: string; reference: string; reminderDate?: string }[] };
type Task = { id: string; title: string; caseId: string; owner: string; dueDate: string; dueTime?: string; done: boolean; createdAtIso?: string; source?: string };
type Alert = { id: string; title: string; caseId: string; owner: string; date: string; time?: string; url?: string; done?: boolean; createdAtIso?: string; source?: string };
type Reminder = { key: string; text: string; targetKind: 'case' | 'task' | 'alert'; targetId: string };

const baseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const injectedKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}') as Record<string, string>;
const serviceKey = injectedKeys.default ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '';
const chatId = Number(Deno.env.get('TELEGRAM_GROUP_CHAT_ID'));
const cronSecret = Deno.env.get('REMINDER_CRON_SECRET') ?? '';
const platformUrl = Deno.env.get('PLATFORM_URL') || 'https://www.barriosvalencia.com/plataforma';

function caseLink(caseId: string): string | null {
  if (!platformUrl) return null;
  const url = new URL(platformUrl);
  url.searchParams.set('caso', caseId);
  return url.toString();
}

function reminderText(heading: string, item: Case, detail: string, owner: string): string {
  const link = caseLink(item.id);
  return `${heading}\nCliente: ${item.client}\n${detail}\nResponsable: ${owner}${link ? `\nAbrir expediente: ${link}` : ''}`;
}

function taskDetail(task: Task, item: Case): string {
  const call = /\b(llamar|llamada|contactar|contacto)\b/i.test(task.title);
  return `${task.title}${call && item.phone ? `\nLlamar a ${item.client}: ${item.phone}` : ''}\nFecha: ${task.dueDate || 'Sin fecha'}${task.dueTime ? ` a las ${task.dueTime}` : ''}`;
}

function alertDetail(alert: Alert): string {
  const link = alert.url && /^https:\/\//i.test(alert.url) ? `\n${/audiencia/i.test(alert.title) ? 'Enlace de la audiencia' : 'Enlace del evento'}: ${alert.url}` : '';
  return `${alert.title}\nFecha: ${alert.date}${alert.time ? ` a las ${alert.time}` : ''}${link}`;
}

function alertHeading(title: string, happensToday = true): string {
  if (/audiencia/i.test(title)) return `${happensToday ? 'Hoy hay una audiencia' : 'Audiencia programada'}: ${title}`;
  return `Alerta para hoy: ${title}`;
}

function todayInBogota(now = new Date()): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
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

function dayOffset(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return '';
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function timeInBogota(now: Date): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now);
}

function stages(date: string, time: string | undefined, today: string, currentTime: string, now: Date): string[] {
  if (!date) return [];
  const result: string[] = [];
  for (const days of [3, 2, 1]) if (dayOffset(date, -days) === today && currentTime >= '08:00') result.push(`${days}d`);
  if (date === today && currentTime >= (time && time < '08:00' ? '00:00' : '08:00') && (!time || currentTime < time)) result.push('hoy');
  if (time && /^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    const dueAt = new Date(`${date}T${time}:00-05:00`).getTime();
    if (now.getTime() >= dueAt - 3600000 && now.getTime() < dueAt) result.push('1h');
  }
  return result;
}

function stageLabel(stage: string): string {
  if (stage === 'hoy') return 'Vence hoy';
  if (stage === '1h') return 'Falta una hora';
  return `Faltan ${stage[0]} días`;
}

function recentlyCreated(iso: string | undefined, now: Date): boolean {
  if (!iso) return false;
  const age = now.getTime() - new Date(iso).getTime();
  return age >= 0 && age < 86400000;
}

function remindersForToday(cases: Case[], tasks: Task[], alerts: Alert[], date: string, now = new Date()): Reminder[] {
  const reminders: Reminder[] = [];
  const currentTime = timeInBogota(now);
  const caseById = new Map(cases.map((item) => [item.id, item]));
  const add = (kind: Reminder['targetKind'], id: string, key: string, heading: string, item: Case, detail: string, owner: string) => {
    reminders.push({ key, targetKind: kind, targetId: id, text: reminderText(heading, item, detail, owner) });
  };
  for (const item of cases) {
    if (item.status === 'Cerrado') continue;
    const owners = (item.owners ?? []).join(', ') || 'Equipo';
    const title = item.alertMessage || item.deadlineLabel || 'Revisar expediente';
    const linkedTask = tasks.some((task) => task.id === item.alertTaskId && task.caseId === item.id);
    if (!linkedTask && item.alertDismissedKey !== `${item.dueDate || ''}|${item.alertDate || ''}`) {
      const recentChange = (item.history ?? []).find((entry) => entry.timestamp && now.getTime() - entry.timestamp >= 0 && now.getTime() - entry.timestamp < 86400000 && /fecha de alerta|fecha l[ií]mite|vencimiento/i.test(entry.action));
      if (recentChange?.timestamp && (item.dueDate || item.alertDate)) {
        add('case', item.id, `case:${item.id}:creada:${recentChange.timestamp}`, 'Nueva alerta del expediente', item, `${title}\nFecha: ${item.dueDate || item.alertDate}${item.dueTime ? ` a las ${item.dueTime}` : ''}`, owners);
      }
      for (const stage of stages(item.dueDate || '', item.dueTime, date, currentTime, now)) {
        add('case', item.id, `case:${item.id}:${item.dueDate}:${item.dueTime || ''}:${stage}`, `${stageLabel(stage)} · ${title}`, item, `Fecha: ${item.dueDate}${item.dueTime ? ` a las ${item.dueTime}` : ''}`, owners);
      }
      if (item.alertDate === date && item.alertDate !== item.dueDate && currentTime >= '08:00') {
        add('case', item.id, `case-extra:${item.id}:${item.alertDate}`, alertHeading(title, !item.dueDate || item.dueDate === date), item, item.dueDate ? `Fecha del evento: ${item.dueDate}` : 'Revisa la alerta del expediente.', owners);
      }
    }
    for (const [index, annotation] of (item.annotations ?? []).entries()) {
      if (annotation.reminderDate !== date || currentTime < '08:00') continue;
      add('case', item.id, `annotation:${item.id}:${index}:${annotation.date}:${annotation.reference}`, 'Recordatorio para hoy', item, annotation.reference || 'Revisar anotación', owners);
    }
  }
  for (const task of tasks) {
    const item = caseById.get(task.caseId);
    if (task.done || !item) continue;
    const owner = task.owner || 'Equipo';
    if (task.source !== 'telegram' && recentlyCreated(task.createdAtIso, now)) add('task', task.id, `task:${task.id}:creada`, 'Nueva tarea', item, taskDetail(task, item), owner);
    for (const stage of stages(task.dueDate, task.dueTime, date, currentTime, now)) {
      add('task', task.id, `task:${task.id}:${task.dueDate}:${task.dueTime || ''}:${stage}`, `${stageLabel(stage)} · Tarea`, item, taskDetail(task, item), owner);
    }
  }
  for (const alert of alerts) {
    const item = caseById.get(alert.caseId);
    if (alert.done || !item) continue;
    const owner = alert.owner || 'Equipo';
    if (alert.source !== 'telegram' && recentlyCreated(alert.createdAtIso, now)) add('alert', alert.id, `alert:${alert.id}:creada`, 'Nueva alerta', item, alertDetail(alert), owner);
    for (const stage of stages(alert.date, alert.time, date, currentTime, now)) {
      const heading = stage === 'hoy' && /audiencia/i.test(alert.title) ? alertHeading(alert.title) : `${stageLabel(stage)} · ${alert.title}`;
      add('alert', alert.id, `alert:${alert.id}:${alert.date}:${alert.time || ''}:${stage}`, heading, item, alertDetail(alert), owner);
    }
  }
  return reminders;
}

function deliveryPath(itemKey: string, date: string) {
  return `telegram_group_reminder_deliveries?reminder_key=eq.${encodeURIComponent(itemKey)}&reminder_date=eq.${date}`;
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  if (!cronSecret || request.headers.get('Authorization') !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  if (!baseUrl || !serviceKey || !botToken || !Number.isSafeInteger(chatId) || chatId >= 0) {
    return new Response('Missing server configuration', { status: 500 });
  }

  try {
    const now = new Date();
    const date = todayInBogota(now);
    const state = await database('platform_state?select=data&id=eq.1');
    const data = state?.[0]?.data;
    if (!data) throw new Error('Platform state missing');
    const reminders = remindersForToday(data.cases ?? [], data.tasks ?? [], data.alerts ?? [], date, now);
    let sent = 0;
    const errors: string[] = [];

    for (const item of reminders) {
      const claimed = await database('rpc/claim_telegram_group_reminder', {
        method: 'POST', body: JSON.stringify({ item_key: item.key, item_date: date }),
      });
      if (!claimed) continue;
      let messageId: number;
      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: item.text.slice(0, 4096) }),
        });
        const delivered = await response.json();
        if (!response.ok || !delivered.ok) throw new Error(`Telegram ${response.status}`);
        messageId = delivered.result.message_id;
      } catch (error) {
        await database(deliveryPath(item.key, date), {
          method: 'DELETE', headers: { Prefer: 'return=minimal' },
        });
        errors.push(error instanceof Error ? error.message : 'Telegram error');
        continue;
      }
      sent++;
      try {
        await database(deliveryPath(item.key, date), {
          method: 'PATCH', headers: { Prefer: 'return=minimal' },
          body: JSON.stringify({ sent_at: new Date().toISOString(), message_id: messageId, target_kind: item.targetKind, target_id: item.targetId }),
        });
      } catch (error) {
        // Telegram accepted the message; keep the claim to avoid a duplicate.
        console.error('Could not store Telegram message id', error);
      }
    }
    return Response.json({ date, sent, failed: errors.length, errors }, { status: errors.length ? 502 : 200 });
  } catch (error) {
    console.error('Telegram reminders failed', error);
    return Response.json({ error: 'Could not process reminders' }, { status: 500 });
  }
});
