import type { PlatformSnapshot } from "./platform-types";

export const initialStatuses = ["Prospecto", "Pendiente", "Esperando respuesta", "Recurso pendiente", "Cerrado", "En consulta", "Esperando fijacion de audiencia", "Pendiente hacer demanda"];
export const initialProcessTypes = ["Indemnizacion sustitutiva", "Reliquidacion pensional", "Pension de invalidez", "Pension de sobrevivientes", "Pension de vejez", "Correccion de historia laboral", "Demanda laboral", "Accidente de trabajo", "Otro"];
export const initialStatusColors: Record<string, string> = { "Prospecto": "#e2e8f0", "Pendiente": "#fef3c7", "Esperando respuesta": "#dbeafe", "Recurso pendiente": "#ffedd5", "Cerrado": "#dcfce7", "En consulta": "#f3e8ff", "Esperando fijacion de audiencia": "#fce7f3", "Pendiente hacer demanda": "#fee2e2" };
export const initialCounterparties = ["Colpensiones", "UGPP", "Fondo privado", "Empleador", "Otra"];
export const initialDocumentCategories = ["Historia laboral", "Resolución", "Poder", "Demanda", "Pruebas", "Respuesta", "Otros"];

export const initialPlatformSnapshot: PlatformSnapshot = {
  cases: [],
  caseFields: [],
  caseColumnOrder: [],
  deletedCases: [],
  statuses: initialStatuses,
  statusColors: initialStatusColors,
  tasks: [],
  alerts: [],
  processTypes: initialProcessTypes,
  payments: [],
  documents: [],
  counterparties: initialCounterparties,
  documentCategories: initialDocumentCategories,
};
