import assert from "node:assert/strict";
import test from "node:test";
import { caseHasEventOnDate, caseMatchesOwner, caseMatchesQuery } from "../src/lib/platform-filters.ts";

const expediente = {
  id: "BV-123",
  client: "ANA PÉREZ",
  nationalId: "123456",
  phone: "3001234567",
  counterparty: "Colpensiones",
  type: "Pensión de vejez",
  status: "Pendiente",
  owners: ["Juan Valencia"],
  alert: "Sin alerta",
  alertDate: "",
  dueDate: "",
  annotations: [],
  history: [],
};

test("a new case is searchable by client, ID, type and counterparty", () => {
  for (const term of ["ana pérez", "BV-123", "pensión", "colpensiones", "123456"]) {
    assert.equal(caseMatchesQuery(expediente, term), true, term);
  }
  assert.equal(caseMatchesQuery(expediente, "UGPP"), false);
  assert.equal(caseMatchesOwner(expediente, "Juan"), true);
  assert.equal(caseMatchesOwner(expediente, "Luis"), false);
  assert.equal(caseMatchesQuery({ ...expediente, customValues: { "CF-1": "Demanda presentada" } }, "demanda presentada"), true);
});

test("today includes linked due dates, reminders and payments", () => {
  const date = "2026-10-07";
  assert.equal(caseHasEventOnDate(expediente, [], date), false);
  assert.equal(caseHasEventOnDate({ ...expediente, dueDate: date }, [], date), true);
  assert.equal(caseHasEventOnDate({ ...expediente, annotations: [{ reminderDate: date }] }, [], date), true);
  assert.equal(caseHasEventOnDate(expediente, [{ caseId: expediente.id, date }], date), true);
  assert.equal(caseHasEventOnDate(expediente, [{ caseId: "otro", date }], date), false);
});
