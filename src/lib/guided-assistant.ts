export type CaseDraft = {
  client?: string;
  nationalId?: string;
  phone?: string;
  type?: string;
  counterparty?: string;
  owner?: string;
  indemnityStage?: "category" | "pension" | "accident";
};

export type RequiredCaseField = "client" | "nationalId" | "phone" | "type" | "counterparty";
export type CaseUpdateField = "status" | "owner" | "phone" | "email" | "counterparty" | "type" | "note";
export type ParsedCaseUpdate = { field?: CaseUpdateField; value?: string };

const fieldOrder: RequiredCaseField[] = ["client", "nationalId", "phone", "type", "counterparty"];

export const fieldQuestions: Record<RequiredCaseField, string> = {
  client: "¿Cuál es el nombre completo del cliente?",
  nationalId: "¿Cuál es su número de cédula?",
  phone: "¿Cuál es el celular del cliente?",
  type: "¿Qué trámite va a llevar el caso? Por ejemplo, indemnización sustitutiva, reliquidación pensional o pensión de sobrevivientes. «Pendiente» sería el estado, no el tipo de proceso.",
  counterparty: "¿Cuál es la entidad o contraparte?",
};

const indemnityCategoryQuestion = "¿Qué clase de indemnización es? Por ejemplo: sustitutiva de una pensión, por despido o por accidente. Si es sustitutiva, también necesito saber si corresponde a vejez, invalidez o sobrevivientes.";
const indemnityPensionQuestion = "¿La indemnización sustitutiva corresponde a pensión de vejez, invalidez o sobrevivientes? Por ejemplo: «sustitutiva de vejez».";
const indemnityAccidentQuestion = "¿El accidente fue de trabajo o de tránsito? Por ejemplo: «accidente de trabajo».";

export function questionForCaseDraft(draft: CaseDraft, field: RequiredCaseField) {
  if (field === "type" && draft.indemnityStage === "category") return indemnityCategoryQuestion;
  if (field === "type" && draft.indemnityStage === "pension") return indemnityPensionQuestion;
  if (field === "type" && draft.indemnityStage === "accident") return indemnityAccidentQuestion;
  return fieldQuestions[field];
}

export function explanationForCaseDraft(draft: CaseDraft, field: RequiredCaseField) {
  if (field === "type" && draft.indemnityStage) {
    return `Me refiero al motivo concreto de la indemnización, para no registrar un tipo equivocado. ${questionForCaseDraft(draft, field)}`;
  }
  if (field === "type") return `El tipo de proceso es el trámite jurídico; «pendiente» es su estado. ${fieldQuestions.type}`;
  if (field === "client") return "Me refiero al nombre completo de la persona del expediente. Por ejemplo: «María López».";
  if (field === "nationalId") return "Me refiero al número de identificación del cliente. Por ejemplo: «CC 12345678».";
  if (field === "phone") return "Me refiero al celular de contacto del cliente. Por ejemplo: «3001234567».";
  return "Me refiero a la entidad o persona frente a la cual se llevará el caso. Por ejemplo: «Colpensiones», «UGPP» o «Empleador».";
}

export function normalizeAssistantText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
}

export function isClarificationRequest(message: string) {
  const value = normalizeAssistantText(message).replace(/[¿?¡!.,]/g, " ").replace(/\s+/g, " ").trim();
  return /\b(como asi|a que te refieres|que quieres decir|que significa|no entiendo|explicame|me explicas|puedes explicar|de que hablas|cual es la diferencia)\b/.test(value);
}

export function isCreateCaseRequest(message: string) {
  const value = normalizeAssistantText(message);
  return /\b(crear|crea|abre|abreme|abrir|nuevo|nueva|registrar|registra|agregar|agrega|ingresar|ingresa)\b/.test(value)
    && (/\b(caso|casos|expediente|expedientes)\b/.test(value) || /\bproceso nuevo\b/.test(value) || /\b(cliente|persona|senora|senor)\b/.test(value));
}

export function isUpdateCaseRequest(message: string) {
  const value = normalizeAssistantText(message);
  if (/\b(actualizar|actualiza|acutalizar|acutaliza|actulizar|actuliza)\b/.test(value)) return true;
  return /\b(editar|edita|modificar|modifica|cambiar|cambia|asignar|asigna)\b/.test(value)
    && /\b(caso|casos|expediente|expedientes|estado|responsable)\b/.test(value);
}

export function isFullPaymentMessage(message: string) {
  const value = normalizeAssistantText(message);
  if (/\b(no|sin|pendiente|parcial|abono)\b/.test(value)) return false;
  return /\b(pago|pagados?|pagadas?|cancel[oó]|cubrio|sald[oó])\b/.test(value)
    && /\b(total(?:mente)?|complet[oa](?:mente)?|todos?|100\s*%)\b/.test(value)
    && /\b(honorarios?|pago|pagados?|saldo)\b/.test(value);
}

export function parseCaseUpdate(message: string, statuses: string[], processTypes: string[], counterparties: string[], activeUser: string, expected?: CaseUpdateField): ParsedCaseUpdate {
  const normalized = normalizeAssistantText(message);
  const field: CaseUpdateField | undefined = expected
    ?? (/\b(estado|etapa)\b/.test(normalized) ? "status"
      : /\b(responsable|asignar|asigna|asignalo|asignaselo)\b/.test(normalized) ? "owner"
        : /\b(celular|telefono|movil)\b/.test(normalized) ? "phone"
          : /\b(correo|email|e-mail)\b/.test(normalized) ? "email"
            : /\b(entidad|contraparte)\b/.test(normalized) ? "counterparty"
              : /\b(tipo|proceso|tramite)\b/.test(normalized) ? "type"
                : /\b(nota|anotacion)\b/.test(normalized) ? "note" : undefined);
  if (!field) return {};

  if (field === "status") {
    const requested = normalized.match(/\b(?:a|en|nuevo estado\s*[:=]?)\s+(.+?)(?:\s+porque\b|$)/)?.[1] ?? normalized;
    return { field, value: knownOption(requested, statuses) };
  }
  if (field === "owner") {
    const owner = /\b(?:juan|luis)\b/.exec(normalized)?.[0];
    if (owner) return { field, value: owner === "juan" ? "Juan Valencia" : "Luis Hernando Barrios" };
    if (/\b(?:a mi|para mi|yo)\b/.test(normalized)) return { field, value: activeUser };
    return { field };
  }
  if (field === "phone") {
    const digits = message.match(/\b\d[\d\s.-]{6,18}\d\b/)?.[0].replace(/\D/g, "");
    return { field, value: digits && digits.length >= 7 ? digits : undefined };
  }
  if (field === "email") return { field, value: message.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0] };
  if (field === "counterparty") return { field, value: knownOption(message, counterparties) };
  if (field === "type") return { field, value: extractIndemnityType(message)?.type ?? findProcessType(message, processTypes) ?? knownOption(message, processTypes.filter((type) => !normalizeAssistantText(type).startsWith("indemnizacion"))) };
  const note = expected === "note" ? message.trim() : message.replace(/^.*?\b(?:nota|anotaci[oó]n)\b\s*(?:diciendo|que diga|:)?\s*/iu, "").trim();
  return { field, value: note && !/^(nota|anotacion)$/i.test(normalizeAssistantText(note)) ? note : undefined };
}

export function isBulkCaseRequest(message: string) {
  const value = normalizeAssistantText(message);
  return /\b(excel|csv|masivo|masiva|varios|muchos|casos|expedientes)\b/.test(value);
}

function knownOption(message: string, options: string[], aliases: Record<string, string> = {}) {
  const normalized = normalizeAssistantText(message);
  for (const [phrase, option] of Object.entries(aliases)) {
    if (new RegExp(`\\b${phrase}\\b`).test(normalized) && options.includes(option)) return option;
  }
  return [...options].sort((a, b) => b.length - a.length).find((option) => normalized.includes(normalizeAssistantText(option)));
}

function isStatusInsteadOfProcess(value: string) {
  return /^(pendiente|prospecto|cerrado|en consulta|esperando respuesta|recurso pendiente|revision documental)$/.test(normalizeAssistantText(value));
}

function findProcessType(message: string, processTypes: string[]) {
  const type = knownOption(message, processTypes, {
    reliquidacion: "Reliquidacion pensional",
    sobrevivientes: "Pension de sobrevivientes",
    invalidez: "Pension de invalidez",
    vejez: "Pension de vejez",
    "historia laboral": "Correccion de historia laboral",
  });
  return type && !isStatusInsteadOfProcess(type) && !normalizeAssistantText(type).startsWith("indemnizacion") ? type : undefined;
}

function extractIndemnityType(message: string, stage?: CaseDraft["indemnityStage"]): Pick<CaseDraft, "type" | "indemnityStage"> | undefined {
  const normalized = normalizeAssistantText(message);
  const mentionsIndemnity = /\bindem\w*zacion\b/.test(normalized) || /\bsustitutiv[ao]\b/.test(normalized);
  const inIndemnityFlow = Boolean(stage || mentionsIndemnity);
  if (!inIndemnityFlow) return undefined;

  const pension = /\b(?:sustitutiv[ao]|pension|vejez|invalidez|sobrevivientes?)\b/.test(normalized);
  if (pension) {
    const risk = /\bvejez\b/.test(normalized) ? "vejez" : /\binvalidez\b/.test(normalized) ? "invalidez" : /\bsobrevivientes?\b/.test(normalized) ? "sobrevivientes" : undefined;
    return risk ? { type: `Indemnizacion sustitutiva de ${risk}`, indemnityStage: undefined } : { indemnityStage: "pension" };
  }
  if (/\b(?:despido|terminacion del contrato)\b/.test(normalized)) return { type: "Indemnizacion por despido", indemnityStage: undefined };
  if (stage === "accident" && /\b(?:trabajo|laboral)\b/.test(normalized)) return { type: "Indemnizacion por accidente de trabajo", indemnityStage: undefined };
  if (stage === "accident" && /\b(?:transito|vehicular)\b/.test(normalized)) return { type: "Indemnizacion por accidente de transito", indemnityStage: undefined };
  if (/\baccidente\b/.test(normalized)) {
    if (/\b(?:trabajo|laboral)\b/.test(normalized)) return { type: "Indemnizacion por accidente de trabajo", indemnityStage: undefined };
    if (/\b(?:transito|vehicular)\b/.test(normalized)) return { type: "Indemnizacion por accidente de transito", indemnityStage: undefined };
    return { indemnityStage: "accident" };
  }
  return { indemnityStage: stage ?? "category" };
}

export function extractCaseDraft(message: string, processTypes: string[], counterparties: string[], awaiting?: RequiredCaseField, activeUser?: string, indemnityStage?: CaseDraft["indemnityStage"]): CaseDraft {
  const draft: CaseDraft = {};
  const clientMatch = message.match(/(?:\bpara\s+|\bcliente\s*(?::|es)?\s*|\bnombre\s*(?::|es)?\s*)([\p{L}][\p{L}' .-]{2,80}?)(?=\s*[,;.]|\s+(?:con|por|en|c[eé]dula|cc|celular|tel[eé]fono|as[ií]gn|responsable)\b|$)/iu);
  if (clientMatch) draft.client = clientMatch[1].trim();

  const idMatch = message.match(/\b(?:c[eé]dula|cc|documento|identificaci[oó]n)\s*(?:n[uú]mero|n[°o.]|#|:)?\s*([\d.\s-]{5,20})/iu);
  if (idMatch) draft.nationalId = idMatch[1].replace(/\D/g, "");

  const phoneMatch = message.match(/\b(?:celular|tel[eé]fono|m[oó]vil)\s*(?:n[uú]mero|n[°o.]|#|:)?\s*([\d\s-]{7,20})/iu);
  if (phoneMatch) draft.phone = phoneMatch[1].replace(/\D/g, "");

  const indemnity = extractIndemnityType(message, indemnityStage);
  const type = indemnity?.type ?? (!indemnity ? findProcessType(message, processTypes) : undefined);
  if (type) {
    draft.type = type;
    if (indemnityStage || indemnity) draft.indemnityStage = undefined;
  } else if (indemnity?.indemnityStage) {
    draft.indemnityStage = indemnity.indemnityStage;
  }

  const counterparty = knownOption(message, counterparties);
  if (counterparty) draft.counterparty = counterparty;

  const ownerMatch = normalizeAssistantText(message).match(/\b(?:asign\w*\s+a|responsable\s*[:=]?|lo\s+lleva|la\s+lleva)\s*(juan|luis)\b|^(juan|luis)$/);
  if (ownerMatch) draft.owner = (ownerMatch[1] || ownerMatch[2]) === "juan" ? "Juan Valencia" : "Luis Hernando Barrios";
  if (activeUser && /\b(?:asign\w*\s+a|responsable\s*[:=]?|lo\s+llevo|la\s+llevo)\s*mi\b/.test(normalizeAssistantText(message))) draft.owner = activeUser;

  if (awaiting && !draft[awaiting]) {
    const answer = message.trim().replace(/[.!]$/, "");
    if (awaiting === "nationalId" && /^[\d.\s-]{5,20}$/.test(answer)) draft.nationalId = answer.replace(/\D/g, "");
    if (awaiting === "phone" && /^[\d\s-]{7,20}$/.test(answer)) draft.phone = answer.replace(/\D/g, "");
    if (awaiting === "client") {
      const leadingName = answer.match(/^([\p{L}][\p{L}' .-]{2,80}?)(?=\s*[,;]|\s+(?:c[eé]dula|cc|celular|tel[eé]fono|por|en)\b|$)/iu);
      if (leadingName) draft.client = leadingName[1].trim();
    }
    if (awaiting === "type" && !indemnity) draft.type = findProcessType(answer, processTypes);
    if (awaiting === "counterparty") draft.counterparty = knownOption(answer, counterparties);
  }

  return draft;
}

export function nextMissingCaseField(draft: CaseDraft): RequiredCaseField | undefined {
  if (draft.indemnityStage) return "type";
  return fieldOrder.find((field) => !draft[field]?.trim() || field === "type" && (Boolean(draft.indemnityStage) || isStatusInsteadOfProcess(draft.type!)));
}
