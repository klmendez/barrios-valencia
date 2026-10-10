import assert from "node:assert/strict";
import test from "node:test";
import { initialPlatformSnapshot } from "../src/lib/platform-defaults.ts";
import { archiveDeletedCase, caseActivity } from "../src/lib/platform-case-deletion.ts";

test("deleting a case removes linked records but keeps its changes in activity", () => {
  const oldChange = { at: "antes", timestamp: 1, by: "Juan Valencia", action: "Cambió estado", detail: "Prospecto → Pendiente", undo: { values: { status: "Prospecto" } } };
  const target = { id: "BV-1", client: "ANA", nationalId: "123", type: "Pensión", status: "Pendiente", counterparty: "Colpensiones", owners: ["Juan Valencia"], fees: "100", paid: "50", history: [oldChange], customValues: { "CF-1": "Demanda" } };
  const other = { id: "BV-2", client: "LUIS", history: [] };
  const field = { id: "CF-1", name: "Etapa", type: "select", options: ["Demanda"] };
  const snapshot = { ...initialPlatformSnapshot, cases: [target, other], caseFields: [field], tasks: [{ id: "T-1", caseId: "BV-1" }, { id: "T-2", caseId: "BV-2" }], alerts: [{ id: "A-1", caseId: "BV-1" }, { id: "A-2", caseId: "BV-2" }], payments: [{ id: "P-1", caseId: "BV-1" }], documents: [{ id: "D-1", caseId: "BV-1" }] };
  const result = archiveDeletedCase(snapshot, "BV-1", "Luis Hernando Barrios", new Date("2026-10-10T12:00:00Z"));
  assert.deepEqual(result.cases.map((item) => item.id), ["BV-2"]);
  assert.deepEqual(result.tasks.map((item) => item.id), ["T-2"]);
  assert.deepEqual(result.alerts.map((item) => item.id), ["A-2"]);
  assert.deepEqual(result.payments, []);
  assert.deepEqual(result.documents, []);
  assert.equal(result.deletedCases[0].case.id, "BV-1");
  assert.equal(result.deletedCases[0].payments.length, 1);
  assert.equal(result.deletedCases[0].alerts.length, 1);
  const activity = caseActivity(result);
  assert.deepEqual(activity.map((entry) => entry.action), ["Eliminó caso", "Cambió estado"]);
  assert.match(activity[0].detail, /Etapa: Demanda/);
  assert.equal(activity[1].undo, undefined);
  assert.equal(activity[0].by, "Luis Hernando Barrios");
});
