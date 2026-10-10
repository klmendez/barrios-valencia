import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

function chatHarness({ draftTableAvailable = true } = {}) {
  const source = readFileSync(new URL("../supabase/functions/telegram-chat/index.ts", import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText;
  const state = { revision: 0, data: { cases: [{ id: "BV-123", client: "ANA", owners: ["Juan Valencia"], history: [] }], tasks: [], alerts: [] } };
  const config = { SUPABASE_URL: "https://example.supabase.co", SUPABASE_SECRET_KEYS: "{}", SUPABASE_SERVICE_ROLE_KEY: "test-key", TELEGRAM_BOT_TOKEN: "test-bot", TELEGRAM_GROUP_CHAT_ID: "-123", TELEGRAM_WEBHOOK_SECRET: "test-webhook-secret" };
  let handler;
  let target;
  let savedDraft = null;
  const sentMessages = [];
  const fetchMock = async (url, init = {}) => {
    const path = String(url);
    if (path.includes("platform_state?select=revision,data")) return Response.json([state]);
    if (path.includes("platform_state?select=data")) return Response.json([{ data: state.data }]);
    if (path.includes("platform_state?id=eq.1") && init.method === "PATCH") {
      const next = JSON.parse(init.body);
      state.data = next.data;
      state.revision = next.revision;
      return Response.json([{ revision: state.revision }]);
    }
    if (path.includes("telegram_processed_updates?") && init.method === "POST") return Response.json([{ update_id: JSON.parse(init.body).update_id }]);
    if (!draftTableAvailable && path.includes("telegram_chat_drafts?")) return Response.json({ message: "table missing" }, { status: 404 });
    if (path.includes("telegram_chat_drafts?on_conflict") && init.method === "POST") { savedDraft = JSON.parse(init.body); return new Response(null, { status: 204 }); }
    if (path.includes("telegram_chat_drafts?chat_id=")) {
      if (init.method === "DELETE") { savedDraft = null; return new Response(null, { status: 204 }); }
      return Response.json(savedDraft ? [savedDraft] : []);
    }
    if (path.includes("telegram_group_reminder_deliveries?")) return Response.json(target ? [target] : []);
    if (path.includes("/sendMessage")) { sentMessages.push(JSON.parse(init.body)); return Response.json({ ok: true, result: { message_id: 99 } }); }
    throw new Error(`Unexpected request: ${path}`);
  };
  const context = { Deno: { env: { get: (name) => config[name] }, serve: (fn) => { handler = fn; } }, fetch: fetchMock, URL, Request, Response, crypto, console };
  vm.runInNewContext(`${code}\nglobalThis.chat = { parseCreate, handleCommand };`, context);
  return { state, handler, chat: context.chat, sentMessages, setTarget: (value) => { target = value; } };
}

test("chat commands validate date and optional time", () => {
  const { chat } = chatHarness();
  assert.equal(chat.parseCreate("BV-123 | Audiencia | 2026-02-30"), null);
  assert.equal(chat.parseCreate("BV-123 | Audiencia | 2026-10-15 | 25:00"), null);
  assert.equal(chat.parseCreate("BV-123 | Audiencia | 2026-10-15 | 09:00").time, "09:00");
});

test("a Telegram task can be created and completed by replying to its reminder", async () => {
  const { chat, state, setTarget } = chatHarness();
  const created = await chat.handleCommand({ text: "/tarea BV-123 | Preparar audiencia | 2026-10-15 | 09:00" }, "Juan Valencia");
  assert.match(created, /Creé la tarea para ANA/);
  assert.equal(state.data.tasks.length, 1);
  assert.equal(state.data.tasks[0].source, "telegram");
  assert.equal(state.data.tasks[0].dueTime, "09:00");
  setTarget({ target_kind: "task", target_id: state.data.tasks[0].id });
  const done = await chat.handleCommand({ text: "tarea realizada", reply_to_message: { message_id: 99 } }, "Luis Hernando Barrios");
  assert.match(done, /detuve los próximos recordatorios/);
  assert.equal(state.data.tasks[0].done, true);
  assert.equal(state.data.tasks[0].completedBy, "Luis Hernando Barrios");
  assert.equal(state.data.cases[0].history.length, 2);
  assert.equal(state.data.cases[0].history[0].action, "Completó tarea desde Telegram");
  assert.equal(state.data.cases[0].history[0].detail, "Preparar audiencia");
});

test("a creation confirmation can be marked as done from the chat", async () => {
  const { chat, state } = chatHarness();
  const created = await chat.handleCommand({ text: "/alerta BV-123 | Audiencia | 2026-10-15 | 09:00" }, "Juan Valencia");
  const done = await chat.handleCommand({ text: "alerta realizada", reply_to_message: { message_id: 99, text: created, from: { is_bot: true } } }, "Luis Hernando Barrios");
  assert.match(done, /detuve los próximos recordatorios/);
  assert.equal(state.data.alerts[0].done, true);
  assert.equal(state.data.alerts[0].completedBy, "Luis Hernando Barrios");
  assert.equal(state.data.cases[0].history[0].action, "Completó alerta desde Telegram");
  assert.equal(state.data.cases[0].history[0].detail, "Audiencia");
});

test("guided alert creation asks for details and stores an audience URL", async () => {
  const { chat, state } = chatHarness();
  const from = { id: 777, first_name: "Juan" };
  const say = (text) => chat.handleCommand({ text, from, reply_to_message: { message_id: 1, from: { is_bot: true } } }, "Juan Valencia");
  assert.match(await say("Crear alerta"), /Vamos a crear una alerta/);
  assert.match(await say("ANA"), /Expediente: ANA/);
  assert.match(await say("Audiencia de conciliación"), /fecha/);
  assert.match(await say("2026-10-15"), /hora/);
  assert.match(await say("09:00"), /enlace/);
  assert.match(await say("https://meet.example.com/sala"), /Confirma/);
  assert.match(await say("Confirmar"), /Creé la alerta/);
  assert.equal(state.data.alerts[0].url, "https://meet.example.com/sala");
  assert.equal(state.data.alerts[0].time, "09:00");
  assert.equal(state.data.cases[0].history[0].action, "Creó alerta desde Telegram");
});

test("guided task creation can omit time and cancel without saving", async () => {
  const { chat, state } = chatHarness();
  const from = { id: 777 };
  const say = (text) => chat.handleCommand({ text, from }, "Luis Hernando Barrios");
  await say("Crear tarea");
  await say("BV-123");
  await say("Llamar cliente");
  await say("2026-10-15");
  await say("Omitir");
  await say("Cancelar");
  assert.equal(state.data.tasks.length, 0);
  await say("Crear tarea");
  await say("BV-123");
  await say("Llamar cliente");
  await say("2026-10-15");
  await say("Omitir");
  await say("Confirmar");
  assert.equal(state.data.tasks[0].dueTime, "");
});

test("the menu offers commands that work with Telegram group privacy", async () => {
  const { handler, sentMessages } = chatHarness();
  const send = (text, updateId) => handler(new Request("https://example.supabase.co/functions/v1/telegram-chat", {
    method: "POST", headers: { "X-Telegram-Bot-Api-Secret-Token": "test-webhook-secret" },
    body: JSON.stringify({ update_id: updateId, message: { message_id: updateId, chat: { id: -123 }, from: { id: 777, first_name: "Juan" }, text } }),
  }));
  assert.equal((await send("/menu", 1)).status, 200);
  assert.equal(sentMessages[0].reply_markup.keyboard[0][0].text, "/crear_tarea");
  assert.equal((await send("/crear_tarea", 2)).status, 200);
  assert.equal(sentMessages[1].reply_markup.force_reply, true);
});

test("existing help command still responds when the draft table is unavailable", async () => {
  const { handler, sentMessages } = chatHarness({ draftTableAvailable: false });
  const response = await handler(new Request("https://example.supabase.co/functions/v1/telegram-chat", {
    method: "POST", headers: { "X-Telegram-Bot-Api-Secret-Token": "test-webhook-secret" },
    body: JSON.stringify({ update_id: 1, message: { message_id: 1, chat: { id: -123 }, from: { id: 777, first_name: "Juan" }, text: "/ayuda" } }),
  }));
  assert.equal(response.status, 200);
  assert.match(sentMessages[0].text, /\/menu/);
});

test("closing a case reminder records the action and suppresses repeated completion", async () => {
  const { chat, state, setTarget } = chatHarness();
  state.data.cases[0].dueDate = "2026-10-15";
  state.data.cases[0].alertDate = "2026-10-14";
  state.data.cases[0].deadlineLabel = "Presentar memorial";
  setTarget({ target_kind: "case", target_id: "BV-123" });
  await chat.handleCommand({ text: "/hecho", reply_to_message: { message_id: 99 } }, "Juan Valencia");
  assert.equal(state.data.cases[0].alertDismissedKey, "2026-10-15|2026-10-14");
  assert.equal(state.data.cases[0].history[0].action, "Cerró aviso del expediente desde Telegram");
  assert.equal(state.data.cases[0].history[0].detail, "Presentar memorial");
  await assert.rejects(chat.handleCommand({ text: "/hecho", reply_to_message: { message_id: 99 } }, "Juan Valencia"), /ya estaba cerrado/);
  assert.equal(state.data.cases[0].history.length, 1);
});

test("webhook rejects requests without Telegram's secret", async () => {
  const { handler } = chatHarness();
  const response = await handler(new Request("https://example.supabase.co/functions/v1/telegram-chat", { method: "POST", headers: { "X-Telegram-Bot-Api-Secret-Token": "wrong" }, body: "{}" }));
  assert.equal(response.status, 401);
});

test("group members can create tasks without pre-registered IDs, outsiders cannot", async () => {
  const { handler, state } = chatHarness();
  const send = (chatId, userId, updateId) => handler(new Request("https://example.supabase.co/functions/v1/telegram-chat", {
    method: "POST", headers: { "X-Telegram-Bot-Api-Secret-Token": "test-webhook-secret" },
    body: JSON.stringify({ update_id: updateId, message: { message_id: updateId, chat: { id: chatId }, from: { id: userId, first_name: "Juan" }, text: "/tarea BV-123 | Revisar expediente | 2026-10-15" } }),
  }));
  assert.equal((await send(-999, 42, 1)).status, 200);
  assert.equal(state.data.tasks.length, 0);
  assert.equal((await send(-123, 777, 2)).status, 200);
  assert.equal(state.data.tasks.length, 1);
  assert.equal(state.data.cases[0].history[0].telegramUserId, 777);
});
