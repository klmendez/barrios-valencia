export type FinancialCase = {
  id: string;
  type: string;
  counterparty: string;
  fees: string;
  paid: string;
};

export type FinancialPayment = { caseId: string; amount: number };

export const amountValue = (value: string) => Number(value.replace(/[^\d]/g, "")) || 0;

export function summarizeCaseFinance<T extends FinancialCase>(
  cases: T[],
  payments: FinancialPayment[],
  key: "type" | "counterparty",
) {
  const paymentsByCase = new Map<string, number>();
  for (const payment of payments) {
    paymentsByCase.set(payment.caseId, (paymentsByCase.get(payment.caseId) ?? 0) + 1);
  }

  const groups = new Map<string, { name: string; count: number; fees: number; paid: number; paymentCount: number }>();
  for (const item of cases) {
    const name = item[key].trim() || (key === "type" ? "Sin tipo" : "Sin contraparte");
    const group = groups.get(name) ?? { name, count: 0, fees: 0, paid: 0, paymentCount: 0 };
    group.count += 1;
    group.fees += amountValue(item.fees);
    group.paid += amountValue(item.paid);
    group.paymentCount += paymentsByCase.get(item.id) ?? 0;
    groups.set(name, group);
  }

  return [...groups.values()]
    .map((group) => ({ ...group, balance: Math.max(0, group.fees - group.paid), averagePaid: group.paid / group.count }))
    .sort((a, b) => b.paid - a.paid || b.count - a.count || a.name.localeCompare(b.name, "es"));
}
