import assert from "node:assert/strict";
import test from "node:test";
import { initialPlatformSnapshot } from "../src/lib/platform-defaults.ts";
import { mergeLocalOnlyRecords, readPlatformSnapshot } from "../src/lib/platform-storage.ts";

test("rejects a damaged browser copy before it can replace stored data", () => {
  assert.throws(() => readPlatformSnapshot({}, initialPlatformSnapshot), /expedientes/);
  assert.throws(() => readPlatformSnapshot({ cases: [], payments: {} }, initialPlatformSnapshot), /payments/);
  assert.throws(() => readPlatformSnapshot({ cases: [], caseFields: [{ id: "a" }] }, initialPlatformSnapshot), /Columnas/);
  assert.throws(() => readPlatformSnapshot({ cases: [], alerts: [{ id: "A-1" }] }, initialPlatformSnapshot), /Alertas/);
});

test("older shared data loads without columns and new columns keep their definitions", () => {
  const previous = readPlatformSnapshot({ cases: [] }, initialPlatformSnapshot);
  assert.deepEqual(previous.caseFields, []);
  assert.deepEqual(previous.caseColumnOrder, []);
  assert.deepEqual(previous.deletedCases, []);
  assert.deepEqual(previous.alerts, []);
  const field = { id: "CF-1", name: "Etapa", type: "select", options: ["Revisión", "Demanda"] };
  const saved = readPlatformSnapshot({ cases: [], caseFields: [field] }, initialPlatformSnapshot);
  assert.deepEqual(saved.caseFields, [field]);
  const alert = { id: "A-1", caseId: "BV-1", title: "Revisar respuesta", date: "2026-10-10", owner: "Juan Valencia", createdAt: "hoy" };
  assert.deepEqual(readPlatformSnapshot({ cases: [], alerts: [alert] }, initialPlatformSnapshot).alerts, [alert]);
});

test("imports records missing from the shared data without replacing shared records", () => {
  const old = { id: "BV-1", client: "Cliente", nationalId: "1", status: "Pendiente" };
  const current = { id: "BV-1", client: "Cliente", nationalId: "1", status: "Cerrado" };
  const extra = { id: "BV-2", client: "Otro", nationalId: "2" };
  const remote = { ...initialPlatformSnapshot, cases: [current] };
  const local = { ...initialPlatformSnapshot, cases: [old, extra] };
  const result = mergeLocalOnlyRecords(remote, local);
  assert.deepEqual(result.snapshot.cases, [current, extra]);
  assert.equal(result.added.cases, 1);
  assert.deepEqual(result.caseCollisions, []);
});
