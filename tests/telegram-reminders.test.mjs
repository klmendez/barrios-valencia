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
  const [reminder] = getReminders(cases, [], alerts, "2026-10-10");
  assert.match(reminder.text, /Hoy hay una audiencia: Audiencia de conciliación a las 9:00/);
  assert.match(reminder.text, /Cliente: KAREN MENDEZ/);
  assert.match(reminder.text, /https:\/\/ejemplo\.com\/plataforma\?caso=BV-432227/);
});

test("an earlier audience reminder does not claim the hearing is today", () => {
  const getReminders = remindersWithPlatformUrl("https://ejemplo.com/plataforma");
  const cases = [{ id: "BV-1", client: "ANA", owners: [], status: "Pendiente", alertDate: "2026-10-10", dueDate: "2026-10-12", alertMessage: "Audiencia inicial" }];
  const [reminder] = getReminders(cases, [], [], "2026-10-10");
  assert.match(reminder.text, /Audiencia programada: Audiencia inicial/);
  assert.match(reminder.text, /Fecha del evento o vencimiento: 2026-10-12/);
});
