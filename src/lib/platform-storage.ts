import type { PlatformSnapshot } from "./platform-types";

const arrayKeys = ["cases", "caseFields", "caseColumnOrder", "deletedCases", "tasks", "alerts", "payments", "documents", "statuses", "processTypes", "counterparties", "documentCategories"] as const;

export function readPlatformSnapshot(value: unknown, defaults: PlatformSnapshot): PlatformSnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Formato de datos inválido");
  const input = value as Record<string, unknown>;
  if (!Array.isArray(input.cases)) throw new Error("Faltan los expedientes");
  for (const key of arrayKeys) {
    if (input[key] !== undefined && !Array.isArray(input[key])) throw new Error(`Campo inválido: ${key}`);
  }
  if (Array.isArray(input.caseFields) && input.caseFields.some((field) => !field || typeof field !== "object" || typeof field.id !== "string" || typeof field.name !== "string" || !["text", "number", "date", "select"].includes(field.type) || !Array.isArray(field.options) || field.options.some((option: unknown) => typeof option !== "string"))) throw new Error("Columnas personalizadas inválidas");
  if (Array.isArray(input.caseColumnOrder) && input.caseColumnOrder.some((id) => typeof id !== "string")) throw new Error("Orden de columnas inválido");
  if (Array.isArray(input.deletedCases) && input.deletedCases.some((entry) => !entry || typeof entry !== "object" || !entry.case || typeof entry.case.id !== "string" || !Array.isArray(entry.case.history) || typeof entry.deletedTimestamp !== "number" || typeof entry.deletedBy !== "string")) throw new Error("Historial de casos eliminados inválido");
  if (Array.isArray(input.alerts) && input.alerts.some((entry) => !entry || typeof entry !== "object" || typeof entry.id !== "string" || typeof entry.caseId !== "string" || typeof entry.title !== "string" || typeof entry.date !== "string" || typeof entry.owner !== "string")) throw new Error("Alertas de calendario inválidas");
  if (input.statusColors !== undefined && (!input.statusColors || typeof input.statusColors !== "object" || Array.isArray(input.statusColors))) throw new Error("Colores inválidos");
  const result = input as Partial<PlatformSnapshot>;
  return {
    cases: result.cases ?? [],
    caseFields: result.caseFields ?? [],
    caseColumnOrder: result.caseColumnOrder ?? [],
    deletedCases: result.deletedCases ?? [],
    statuses: result.statuses?.length ? result.statuses : defaults.statuses,
    statusColors: { ...defaults.statusColors, ...result.statusColors },
    tasks: result.tasks ?? [],
    alerts: result.alerts ?? [],
    processTypes: result.processTypes?.length ? result.processTypes : defaults.processTypes,
    payments: result.payments ?? [],
    documents: result.documents ?? [],
    counterparties: result.counterparties?.length ? result.counterparties : defaults.counterparties,
    documentCategories: result.documentCategories?.length ? result.documentCategories : defaults.documentCategories,
  };
}

export function hasPlatformRecords(snapshot: PlatformSnapshot) {
  return snapshot.cases.length > 0 || snapshot.tasks.length > 0 || snapshot.alerts.length > 0 || snapshot.payments.length > 0 || snapshot.documents.length > 0;
}

export function mergeLocalOnlyRecords(remote: PlatformSnapshot, local: PlatformSnapshot) {
  const added = { cases: 0, tasks: 0, alerts: 0, payments: 0, documents: 0 };
  const appendNew = <T extends { id: string }>(key: keyof typeof added, shared: T[], browser: T[]) => {
    const ids = new Set(shared.map((item) => item.id));
    const additions = browser.filter((item) => !ids.has(item.id));
    added[key] = additions.length;
    return [...shared, ...additions];
  };
  const snapshot: PlatformSnapshot = {
    cases: appendNew("cases", remote.cases, local.cases),
    caseFields: [...remote.caseFields, ...local.caseFields.filter((field) => !remote.caseFields.some((shared) => shared.id === field.id))],
    caseColumnOrder: remote.caseColumnOrder.length ? remote.caseColumnOrder : local.caseColumnOrder,
    deletedCases: [...remote.deletedCases, ...local.deletedCases.filter((item) => !remote.deletedCases.some((shared) => shared.case.id === item.case.id && shared.deletedTimestamp === item.deletedTimestamp))],
    tasks: appendNew("tasks", remote.tasks, local.tasks),
    alerts: appendNew("alerts", remote.alerts, local.alerts),
    payments: appendNew("payments", remote.payments, local.payments),
    documents: appendNew("documents", remote.documents, local.documents),
    statuses: [...new Set([...remote.statuses, ...local.statuses])],
    statusColors: { ...local.statusColors, ...remote.statusColors },
    processTypes: [...new Set([...remote.processTypes, ...local.processTypes])],
    counterparties: [...new Set([...remote.counterparties, ...local.counterparties])],
    documentCategories: [...new Set([...remote.documentCategories, ...local.documentCategories])],
  };
  const caseCollisions = local.cases.filter((item) => {
    const existing = remote.cases.find((shared) => shared.id === item.id);
    return existing && (existing.client !== item.client || existing.nationalId !== item.nationalId);
  }).map((item) => item.id);
  return { snapshot, added, caseCollisions };
}
