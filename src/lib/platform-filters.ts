export type SearchableCase = {
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
  status: string;
  customValues?: Record<string, string>;
  owners: string[];
  alert: string;
  alertDate: string;
  dueDate: string;
  annotations?: { reminderDate?: string }[];
  history: { timestamp?: number }[];
};

export type DatedPayment = { caseId: string; date: string };

export function caseMatchesQuery(item: SearchableCase, query: string) {
  const term = query.trim().toLocaleLowerCase();
  if (!term) return true;
  return `${item.id} ${item.client} ${item.nationalId ?? ""} ${item.phone ?? ""} ${item.email ?? ""} ${item.relativeName ?? ""} ${item.relativePhone ?? ""} ${item.relativeRelationship ?? ""} ${item.counterparty} ${item.type} ${item.status} ${Object.values(item.customValues ?? {}).join(" ")} ${item.owners.join(" ")} ${item.alert} ${item.alertDate} ${item.dueDate}`.toLocaleLowerCase().includes(term);
}

export function caseMatchesOwner(item: SearchableCase, ownerPrefix: string) {
  return item.owners.some((owner) => owner.startsWith(ownerPrefix));
}

export function caseHasEventOnDate(item: SearchableCase, payments: DatedPayment[], date: string) {
  return item.dueDate === date || item.alertDate === date || (item.annotations ?? []).some((annotation) => annotation.reminderDate === date) || payments.some((payment) => payment.caseId === item.id && payment.date === date) || item.history.some((entry) => entry.timestamp && new Date(entry.timestamp).toLocaleDateString("sv-SE") === date);
}
