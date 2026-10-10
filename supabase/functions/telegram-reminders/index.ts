type Case = { id: string; client: string; owners: string[]; status: string; alertDate?: string; alertMessage?: string; deadlineLabel?: string; dueDate?: string; annotations?: { date: string; reference: string; reminderDate?: string }[] };
type Task = { id: string; title: string; caseId: string; owner: string; dueDate: string; done: boolean };
type Alert = { id: string; title: string; caseId: string; owner: string; date: string };
type Reminder = { key: string; text: string };

const baseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const injectedKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}') as Record<string, string>;
const serviceKey = injectedKeys.default ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '';
const chatId = Number(Deno.env.get('TELEGRAM_GROUP_CHAT_ID'));
const cronSecret = Deno.env.get('REMINDER_CRON_SECRET') ?? '';
const platformUrl = Deno.env.get('PLATFORM_URL') ?? '';

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

function alertHeading(title: string, happensToday = true): string {
  if (/audiencia/i.test(title)) return `${happensToday ? 'Hoy hay una audiencia' : 'Audiencia programada'}: ${title}`;
  return `Alerta para hoy: ${title}`;
}

function todayInBogota(): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
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

function remindersForToday(cases: Case[], tasks: Task[], alerts: Alert[], date: string): Reminder[] {
  const reminders: Reminder[] = [];
  const caseById = new Map(cases.map((item) => [item.id, item]));
  for (const item of cases) {
    if (item.status === 'Cerrado') continue;
    const owners = (item.owners ?? []).join(', ') || 'Equipo';
    if (item.alertDate === date) reminders.push({
      key: `case-alert:${item.id}`,
      text: reminderText(alertHeading(item.alertMessage || item.deadlineLabel || 'Revisar expediente', !item.dueDate || item.dueDate === date), item, item.dueDate ? `Fecha del evento o vencimiento: ${item.dueDate}` : 'Revisa la alerta del expediente.', owners),
    });
    if (item.dueDate === date && item.alertDate !== date) reminders.push({
      key: `case-deadline:${item.id}`,
      text: reminderText('Vence hoy el plazo del expediente', item, item.deadlineLabel || 'Revisar plazo del expediente', owners),
    });
    for (const [index, annotation] of (item.annotations ?? []).entries()) {
      if (annotation.reminderDate !== date) continue;
      reminders.push({
        key: `annotation:${item.id}:${index}:${annotation.date}:${annotation.reference}`,
        text: reminderText('Recordatorio para hoy', item, annotation.reference || 'Revisar anotación', owners),
      });
    }
  }
  for (const task of tasks) {
    if (task.done || task.dueDate !== date || !caseById.has(task.caseId)) continue;
    reminders.push({
      key: `task:${task.id}`,
      text: reminderText('Tarea para hoy', caseById.get(task.caseId)!, task.title, task.owner || 'Equipo'),
    });
  }
  for (const alert of alerts) {
    if (alert.date !== date || !caseById.has(alert.caseId)) continue;
    reminders.push({
      key: `calendar-alert:${alert.id}`,
      text: reminderText(alertHeading(alert.title), caseById.get(alert.caseId)!, 'Revisa los detalles en el expediente.', alert.owner || 'Equipo'),
    });
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
    const date = todayInBogota();
    const state = await database('platform_state?select=data&id=eq.1');
    const data = state?.[0]?.data;
    if (!data) throw new Error('Platform state missing');
    const reminders = remindersForToday(data.cases ?? [], data.tasks ?? [], data.alerts ?? [], date);
    let sent = 0;
    const errors: string[] = [];

    for (const item of reminders) {
      const claimed = await database('rpc/claim_telegram_group_reminder', {
        method: 'POST', body: JSON.stringify({ item_key: item.key, item_date: date }),
      });
      if (!claimed) continue;
      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: item.text.slice(0, 4096) }),
        });
        if (!response.ok || !(await response.json()).ok) throw new Error(`Telegram ${response.status}`);
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
          body: JSON.stringify({ sent_at: new Date().toISOString() }),
        });
      } catch (error) {
        // Telegram accepted the message; keep the claim to avoid a duplicate.
        console.error('Could not mark Telegram reminder as sent', error);
      }
    }
    return Response.json({ date, sent, failed: errors.length, errors }, { status: errors.length ? 502 : 200 });
  } catch (error) {
    console.error('Telegram reminders failed', error);
    return Response.json({ error: 'Could not process reminders' }, { status: 500 });
  }
});
