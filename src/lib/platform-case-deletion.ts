import type { CaseHistoryEntry, DeletedCaseRecord, PlatformSnapshot } from "./platform-types";

export type CaseActivityEntry = CaseHistoryEntry & { caseId: string; caseName: string; historyKey: string; archived?: boolean };

export function archiveDeletedCase(snapshot: PlatformSnapshot, caseId: string, actor: string, at: Date, reason: DeletedCaseRecord["reason"] = "manual"): PlatformSnapshot {
  const target = snapshot.cases.find((item) => item.id === caseId);
  if (!target) return snapshot;
  const archived: DeletedCaseRecord = {
    case: target,
    caseFields: snapshot.caseFields,
    tasks: snapshot.tasks.filter((item) => item.caseId === caseId),
    alerts: snapshot.alerts.filter((item) => item.caseId === caseId),
    payments: snapshot.payments.filter((item) => item.caseId === caseId),
    documents: snapshot.documents.filter((item) => item.caseId === caseId),
    deletedAt: at.toLocaleString("es-CO"),
    deletedTimestamp: at.getTime(),
    deletedBy: actor,
    reason,
  };
  return {
    ...snapshot,
    cases: snapshot.cases.filter((item) => item.id !== caseId),
    tasks: snapshot.tasks.filter((item) => item.caseId !== caseId),
    alerts: snapshot.alerts.filter((item) => item.caseId !== caseId),
    payments: snapshot.payments.filter((item) => item.caseId !== caseId),
    documents: snapshot.documents.filter((item) => item.caseId !== caseId),
    deletedCases: [archived, ...snapshot.deletedCases],
  };
}

export function caseActivity(snapshot: PlatformSnapshot): CaseActivityEntry[] {
  const active = snapshot.cases.flatMap((item) => item.history.map((entry, index) => ({ ...entry, caseId: item.id, caseName: item.client, historyKey: `${item.id}-${entry.timestamp ?? entry.at}-${index}` })));
  const deleted = snapshot.deletedCases.flatMap((archive) => {
    const item = archive.case;
    const customValues = (archive.caseFields ?? snapshot.caseFields).filter((field) => item.customValues?.[field.id]).map((field) => `${field.name}: ${item.customValues?.[field.id]}`);
    const detail = [
      `Expediente: ${item.id}`,
      `Cliente: ${item.client}`,
      `Cédula: ${item.nationalId || "Sin registrar"}`,
      `Tipo: ${item.type}`,
      `Estado: ${item.status}`,
      `Contraparte: ${item.counterparty}`,
      `Responsable: ${item.owners.join(", ") || "Sin registrar"}`,
      `Honorarios: ${item.fees || "Sin registrar"}`,
      `Pagado: ${item.paid || "Sin registrar"}`,
      ...customValues,
      `Registros vinculados retirados: ${archive.tasks.length} tareas, ${archive.alerts?.length ?? 0} alertas, ${archive.payments.length} pagos y ${archive.documents.length} documentos.`,
    ].join("\n");
    const removal: CaseActivityEntry = {
      at: archive.deletedAt,
      timestamp: archive.deletedTimestamp,
      by: archive.deletedBy,
      action: archive.reason === "manual" ? "Eliminó caso" : "Deshizo creación de caso",
      detail,
      caseId: item.id,
      caseName: item.client,
      historyKey: `deleted-${item.id}-${archive.deletedTimestamp}`,
      archived: true,
    };
    const history = item.history.map((entry, index): CaseActivityEntry => ({ ...entry, undo: undefined, caseId: item.id, caseName: item.client, historyKey: `archived-${item.id}-${archive.deletedTimestamp}-${index}`, archived: true }));
    return [removal, ...history];
  });
  return [...active, ...deleted].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
}
