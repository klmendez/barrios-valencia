import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

function remindersWithPlatformUrl(url) {
  const source = readFileSync(new URL("../supabase/functions/telegram-reminders/index.ts", import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText;
  const context = {
    Deno: { env: { get: (key) => key === "PLATFORM_URL" ? url : key === "SUPABASE_SECRET_KEYS" ? "{}" : "" }, serve: () => {} },
    URL,
  };
  vm.runInNewContext(`${code}\nglobalThis.getReminders = remindersForToday;`, context);
  return context.getReminders;
}

test("an audience alert names the client and links to the matching case", () => {
  const getReminders = remindersWithPlatformUrl("https://ejemplo.com/plataforma");
  const cases = [{ id: "BV-432227", client: "KAREN MENDEZ", owners: ["Juan Valencia"], status: "Pendiente" }];
  const alerts = [{ id: "A-1", caseId: "BV-432227", title: "Audiencia de conciliación a las 9:00", date: "2026-10-10", owner: "Juan Valencia" }];
  const [reminder] = getReminders(cases, [], alerts, "2026-10-10", new Date("2026-10-10T14:30:00Z"));
  assert.match(reminder.text, /Hoy hay una audiencia: Audiencia de conciliación a las 9:00/);
  assert.match(reminder.text, /Cliente: KAREN MENDEZ/);
  assert.match(reminder.text, /https:\/\/ejemplo\.com\/plataforma\?caso=BV-432227/);
});

test("an earlier audience reminder does not claim the hearing is today", () => {
  const getReminders = remindersWithPlatformUrl("https://ejemplo.com/plataforma");
  const cases = [{ id: "BV-1", client: "ANA", owners: [], status: "Pendiente", alertDate: "2026-10-10", dueDate: "2026-10-12", alertMessage: "Audiencia inicial" }];
  const reminder = getReminders(cases, [], [], "2026-10-10", new Date("2026-10-10T14:30:00Z")).find((item) => item.key.startsWith("case-extra:"));
  assert.ok(reminder);
  assert.match(reminder.text, /Audiencia programada: Audiencia inicial/);
  assert.match(reminder.text, /Fecha del evento: 2026-10-12/);
});

test("tasks and alerts get creation and staged reminders until completed", () => {
  const getReminders = remindersWithPlatformUrl("https://ejemplo.com/plataforma");
  const now = new Date("2026-10-10T14:30:00Z");
  const cases = [{ id: "BV-1", client: "ANA", owners: ["Juan Valencia"], status: "Pendiente" }];
  const task = { id: "T-1", caseId: "BV-1", title: "Preparar audiencia", owner: "Juan Valencia", dueDate: "2026-10-13", done: false, createdAtIso: now.toISOString() };
  const alert = { id: "A-1", caseId: "BV-1", title: "Audiencia", owner: "Juan Valencia", date: "2026-10-13", done: false, createdAtIso: now.toISOString() };
  const reminders = getReminders(cases, [task], [alert], "2026-10-10", now);
  assert.deepEqual(Array.from(reminders, (item) => item.key).sort(), ["task:T-1:creada", "task:T-1:2026-10-13::3d", "alert:A-1:creada", "alert:A-1:2026-10-13::3d"].sort());
  assert.equal(getReminders(cases, [{ ...task, done: true }], [{ ...alert, done: true }], "2026-10-10", now).length, 0);
});

test("the one-hour reminder requires an event time", () => {
  const getReminders = remindersWithPlatformUrl("");
  const cases = [{ id: "BV-1", client: "ANA", owners: [], status: "Pendiente" }];
  const now = new Date("2026-10-10T14:30:00Z");
  const task = { id: "T-1", caseId: "BV-1", title: "Audiencia", owner: "Juan Valencia", dueDate: "2026-10-10", dueTime: "10:00", done: false };
  assert.ok(getReminders(cases, [task], [], "2026-10-10", now).some((item) => item.key.endsWith(":1h")));
  assert.ok(!getReminders(cases, [{ ...task, dueTime: "" }], [], "2026-10-10", now).some((item) => item.key.endsWith(":1h")));
});

test("call tasks include the client's saved phone and case link", () => {
  const getReminders = remindersWithPlatformUrl("https://ejemplo.com/plataforma");
  const now = new Date("2026-10-10T14:30:00Z");
  const cases = [{ id: "BV-1", client: "ANA", phone: "3001234567", owners: [], status: "Pendiente" }];
  const tasks = [{ id: "T-1", caseId: "BV-1", title: "Llamar cliente", owner: "Juan Valencia", dueDate: "2026-10-10", done: false }];
  const reminder = getReminders(cases, tasks, [], "2026-10-10", now)[0];
  assert.match(reminder.text, /Llamar a ANA: 3001234567/);
  assert.match(reminder.text, /https:\/\/ejemplo\.com\/plataforma\?caso=BV-1/);
});

test("audience alerts include their saved meeting URL", () => {
  const getReminders = remindersWithPlatformUrl("https://ejemplo.com/plataforma");
  const now = new Date("2026-10-10T14:30:00Z");
  const cases = [{ id: "BV-1", client: "ANA", owners: [], status: "Pendiente" }];
  const alerts = [{ id: "A-1", caseId: "BV-1", title: "Audiencia inicial", date: "2026-10-10", owner: "Juan Valencia", url: "https://meet.example.com/sala" }];
  const reminder = getReminders(cases, [], alerts, "2026-10-10", now)[0];
  assert.match(reminder.text, /Enlace de la audiencia: https:\/\/meet\.example\.com\/sala/);
  assert.match(reminder.text, /https:\/\/ejemplo\.com\/plataforma\?caso=BV-1/);
});
