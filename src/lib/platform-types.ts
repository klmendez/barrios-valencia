export type CaseAnnotation = { date: string; reference: string; text: string; by: string; reminderDate?: string };
export type CustomCaseField = { id: string; name: string; type: "text" | "number" | "date" | "select"; options: string[] };

export type CaseRecord = {
  id: string;
  client: string;
  nationalId?: string;
  phone?: string;
  email?: string;
  relativeName?: string;
  relativePhone?: string;
  relativeRelationship?: string;
  counterparty: string;
  type: string;
  owners: string[];
  status: string;
  alert: string;
  alertDate: string;
  deadlineLabel?: string;
  alertMessage?: string;
  alertTaskId?: string;
  dueDate: string;
  fees: string;
  paid: string;
  notes: string[];
  annotations?: CaseAnnotation[];
  nextPaymentDate?: string;
  driveUrl: string;
  history: CaseHistoryEntry[];
  customValues?: Record<string, string>;
};

export type CaseHistoryEntry = { at: string; timestamp?: number; by: string; action: string; detail: string; undo?: { values?: Partial<Omit<CaseRecord, "id" | "history">>; deleteCase?: boolean; paymentId?: string; documentId?: string; taskCreateId?: string; taskState?: { id: string; done: boolean; completedBy?: string } } };
export type PaymentRecord = { id: string; caseId: string; amount: number; date: string; note: string; by: string };
export type DocumentRecord = { id: string; caseId: string; name: string; category: string; url: string; addedAt: string; by: string };
export type TaskRecord = { id: string; title: string; caseId: string; owner: string; priority: "Alta" | "Media" | "Baja"; dueDate: string; done: boolean; createdAt: string; completedBy?: string };
export type CalendarAlertRecord = { id: string; caseId: string; title: string; date: string; owner: string; createdAt: string };
export type DeletedCaseRecord = { case: CaseRecord; caseFields: CustomCaseField[]; tasks: TaskRecord[]; alerts: CalendarAlertRecord[]; payments: PaymentRecord[]; documents: DocumentRecord[]; deletedAt: string; deletedTimestamp: number; deletedBy: string; reason: "manual" | "undo_creation" };

export type PlatformSnapshot = {
  cases: CaseRecord[];
  caseFields: CustomCaseField[];
  caseColumnOrder: string[];
  deletedCases: DeletedCaseRecord[];
  statuses: string[];
  statusColors: Record<string, string>;
  tasks: TaskRecord[];
  alerts: CalendarAlertRecord[];
  processTypes: string[];
  payments: PaymentRecord[];
  documents: DocumentRecord[];
  counterparties: string[];
  documentCategories: string[];
};
