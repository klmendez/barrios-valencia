export const baseCaseColumnIds = [
  "client", "nationalId", "phone", "email", "relativeName", "relativePhone", "relativeRelationship",
  "counterparty", "type", "owners", "status", "alert", "dueDate", "fees", "paid",
] as const;

export function resolveCaseColumnOrder(savedOrder: string[], customIds: string[]) {
  const known = [...baseCaseColumnIds, ...customIds];
  const knownIds = new Set<string>(known);
  return [...new Set([...savedOrder.filter((id) => knownIds.has(id)), ...known])];
}

export function moveCaseColumn(order: string[], sourceId: string, targetId: string) {
  if (sourceId === targetId || !order.includes(sourceId) || !order.includes(targetId)) return order;
  const targetIndex = order.indexOf(targetId);
  const moved = order.filter((id) => id !== sourceId);
  moved.splice(targetIndex, 0, sourceId);
  return moved;
}
