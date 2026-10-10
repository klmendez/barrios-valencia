import assert from "node:assert/strict";
import test from "node:test";
import { explanationForCaseDraft, extractCaseDraft, isBulkCaseRequest, isClarificationRequest, isCreateCaseRequest, isFullPaymentMessage, isUpdateCaseRequest, nextMissingCaseField, parseCaseUpdate, questionForCaseDraft } from "../src/lib/guided-assistant.ts";

test("recognizes a full payment without treating a partial or unpaid balance as complete", () => {
  assert.equal(isFullPaymentMessage("ella ya hizo el pago total de los honorarios"), true);
  assert.equal(isFullPaymentMessage("ya pagó todos los honorarios"), true);
  assert.equal(isFullPaymentMessage("no ha pagado el total de los honorarios"), false);
  assert.equal(isFullPaymentMessage("hizo un abono parcial de los honorarios"), false);
});

const processTypes = ["Reliquidacion pensional", "Pension de sobrevivientes", "Pension de vejez", "Indemnizacion sustitutiva", "Pendiente"];
const counterparties = ["Colpensiones", "UGPP", "Fondo privado"];

test("extracts a new case request and asks only for the missing phone", () => {
  const message = "Abre un caso para María López, cédula 12345, por reliquidación en Colpensiones y asígnaselo a Luis.";
  assert.equal(isCreateCaseRequest(message), true);
  const draft = extractCaseDraft(message, processTypes, counterparties);
  assert.deepEqual(draft, {
    client: "María López",
    nationalId: "12345",
    type: "Reliquidacion pensional",
    counterparty: "Colpensiones",
    owner: "Luis Hernando Barrios",
  });
  assert.equal(nextMissingCaseField(draft), "phone");
  const updated = { ...draft, ...extractCaseDraft("300 123 4567", processTypes, counterparties, "phone") };
  assert.equal(updated.phone, "3001234567");
  assert.equal(nextMissingCaseField(updated), undefined);
});

test("accepts the client's name and other facts in a follow-up message", () => {
  const draft = extractCaseDraft("María López, CC 12345, celular 3001234567 por pensión de sobrevivientes en UGPP", processTypes, counterparties, "client");
  assert.equal(draft.client, "María López");
  assert.equal(draft.nationalId, "12345");
  assert.equal(draft.phone, "3001234567");
  assert.equal(draft.type, "Pension de sobrevivientes");
  assert.equal(draft.counterparty, "UGPP");
});

test("recognizes bulk requests without treating one case as bulk", () => {
  assert.equal(isBulkCaseRequest("Quiero abrir 300 casos con un Excel"), true);
  assert.equal(isBulkCaseRequest("Quiero abrir un caso"), false);
  assert.equal(isCreateCaseRequest("Ábreme un expediente"), true);
  assert.equal(isCreateCaseRequest("Necesito registrar una señora nueva"), true);
});

test("asks which indemnity is intended, even with a typo", () => {
  const message = "abre un caso para karen liseth mendez por indemizacion en colpensiones y asignamelo a mi";
  const draft = extractCaseDraft(message, processTypes, counterparties, undefined, "Juan Valencia");
  assert.equal(draft.client, "karen liseth mendez");
  assert.equal(draft.type, undefined);
  assert.equal(draft.indemnityStage, "category");
  assert.equal(draft.counterparty, "Colpensiones");
  assert.equal(draft.owner, "Juan Valencia");
  assert.equal(nextMissingCaseField(draft), "type");
  assert.match(questionForCaseDraft(draft, "type"), /sustitutiva.*despido.*accidente/i);
  assert.equal(extractCaseDraft("Indemización", processTypes, counterparties, "type").indemnityStage, "category");
  const pension = { ...draft, ...extractCaseDraft("Sustitutiva", processTypes, counterparties, "type", "Juan Valencia", draft.indemnityStage) };
  assert.equal(pension.indemnityStage, "pension");
  assert.equal(nextMissingCaseField(pension), "type");
  assert.match(questionForCaseDraft(pension, "type"), /vejez.*invalidez.*sobrevivientes/i);
  const specific = { ...pension, ...extractCaseDraft("de vejez", processTypes, counterparties, "type", "Juan Valencia", pension.indemnityStage) };
  assert.equal(specific.type, "Indemnizacion sustitutiva de vejez");
  assert.equal(specific.indemnityStage, undefined);
  assert.equal(nextMissingCaseField(specific), "nationalId");
});

test("does not accept a case status as a process type", () => {
  assert.equal(extractCaseDraft("pendiente", processTypes, counterparties, "type").type, undefined);
  assert.equal(nextMissingCaseField({ client: "Karen", nationalId: "1002969045", phone: "3135707125", type: "Pendiente", counterparty: "Colpensiones" }), "type");
  assert.equal(extractCaseDraft("Como asi ??", processTypes, counterparties, "type").type, undefined);
});

test("explains clarification requests with the current indemnity question", () => {
  const draft = { indemnityStage: "category" };
  for (const message of ["¿A qué te refieres?", "como asi??", "No entiendo", "¿Qué quieres decir con eso?"]) {
    assert.equal(isClarificationRequest(message), true);
  }
  assert.match(explanationForCaseDraft(draft, "type"), /motivo concreto.*sustitutiva.*despido.*accidente/i);
  assert.match(explanationForCaseDraft({}, "nationalId"), /identificación.*CC 12345678/i);
});

test("accepts a specific non-pension indemnity", () => {
  assert.equal(extractCaseDraft("indemnización por despido", processTypes, counterparties).type, "Indemnizacion por despido");
  const accident = extractCaseDraft("indemnización por accidente", processTypes, counterparties);
  assert.equal(accident.indemnityStage, "accident");
  const followUp = extractCaseDraft("de trabajo", processTypes, counterparties, "type", undefined, accident.indemnityStage);
  assert.equal(followUp.type, "Indemnizacion por accidente de trabajo");
});

test("recognizes an update request and extracts common changes", () => {
  const statuses = ["Prospecto", "Pendiente", "Esperando respuesta"];
  assert.equal(isUpdateCaseRequest("actualizar un caso"), true);
  assert.equal(isUpdateCaseRequest("actualizar"), true);
  assert.equal(isUpdateCaseRequest("acutalizar"), true);
  assert.equal(isUpdateCaseRequest("actulizar caso"), true);
  assert.equal(isUpdateCaseRequest("cambiar de página"), false);
  assert.deepEqual(parseCaseUpdate("cambia el estado a Esperando respuesta", statuses, processTypes, counterparties, "Luis Hernando Barrios"), { field: "status", value: "Esperando respuesta" });
  assert.deepEqual(parseCaseUpdate("asignar responsable a mi", statuses, processTypes, counterparties, "Luis Hernando Barrios"), { field: "owner", value: "Luis Hernando Barrios" });
  assert.deepEqual(parseCaseUpdate("3135707125", statuses, processTypes, counterparties, "Luis Hernando Barrios", "phone"), { field: "phone", value: "3135707125" });
  assert.deepEqual(parseCaseUpdate("cambia el tipo a reliquidación", statuses, processTypes, counterparties, "Luis Hernando Barrios"), { field: "type", value: "Reliquidacion pensional" });
});
