import type { PlatformSnapshot } from "./platform-types";

type Choice = "report" | "local" | "remote";
type MergeResult = { snapshot: PlatformSnapshot; conflicts: string[] };

const entityKeys = new Set(["cases", "caseFields", "deletedCases", "tasks", "alerts", "payments", "documents"]);
const listKeys = new Set(["statuses", "processTypes", "counterparties", "documentCategories", "options", "notes", "annotations"]);
const amountValue = (value: string) => Number(value.replace(/[^\d]/g, "")) || 0;

function same(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function entryKey(value: unknown, key: string) {
  if (key === "deletedCases" && isObject(value) && isObject(value.case)) return `${value.case.id}-${value.deletedTimestamp}`;
  return isObject(value) ? String(value.id) : "";
}

export function mergeConcurrentSnapshots(base: PlatformSnapshot, local: PlatformSnapshot, remote: PlatformSnapshot, choice: Choice = "report"): MergeResult {
  const conflicts: string[] = [];

  const merge = (before: unknown, mine: unknown, theirs: unknown, path: string[]): unknown => {
    if (same(mine, theirs)) return mine;
    if (same(mine, before)) return theirs;
    if (same(theirs, before)) return mine;

    const key = path.at(-1) ?? "";
    if (Array.isArray(mine) && Array.isArray(theirs)) {
      if (entityKeys.has(key)) {
        const prior = Array.isArray(before) ? before : [];
        const ids = [...new Set([...theirs, ...mine, ...prior].map((item) => entryKey(item, key)))];
        return ids.flatMap((id) => {
          const found = merge(
            prior.find((item) => entryKey(item, key) === id),
            mine.find((item) => entryKey(item, key) === id),
            theirs.find((item) => entryKey(item, key) === id),
            [...path, id],
          );
          return found === undefined ? [] : [found];
        });
      }
      if (key === "history") {
        const id = (entry: unknown) => isObject(entry) ? `${entry.timestamp ?? entry.at}-${entry.by}-${entry.action}-${entry.detail}` : JSON.stringify(entry);
        const prior = Array.isArray(before) ? before : [];
        const ids = [...new Set([...theirs, ...mine, ...prior].map(id))];
        return ids.flatMap((entryId) => {
          const found = merge(prior.find((entry) => id(entry) === entryId), mine.find((entry) => id(entry) === entryId), theirs.find((entry) => id(entry) === entryId), [...path, entryId]);
          return found === undefined ? [] : [found];
        }).sort((a, b) => (Number(isObject(b) ? b.timestamp : 0) || 0) - (Number(isObject(a) ? a.timestamp : 0) || 0));
      }
      if (listKeys.has(key)) {
        const unique = new Map<string, unknown>();
        for (const item of [...theirs, ...mine]) unique.set(JSON.stringify(item), item);
        return [...unique.values()];
      }
    }

    if (isObject(mine) && isObject(theirs) && (isObject(before) || before === undefined)) {
      const prior = isObject(before) ? before : {};
      const fields = [...new Set([...Object.keys(prior), ...Object.keys(theirs), ...Object.keys(mine)])];
      return Object.fromEntries(fields.flatMap((field) => {
        const value = merge(prior[field], mine[field], theirs[field], [...path, field]);
        return value === undefined ? [] : [[field, value]];
      }));
    }

    conflicts.push(path.join("."));
    return choice === "remote" ? theirs : mine;
  };

  const snapshot = merge(base, local, remote, []) as PlatformSnapshot;
  for (const original of base.cases) {
    const mine = local.cases.find((item) => item.id === original.id);
    const theirs = remote.cases.find((item) => item.id === original.id);
    const combined = snapshot.cases.find((item) => item.id === original.id);
    if (!mine || !theirs || !combined || same(mine.paid, original.paid) || same(theirs.paid, original.paid)) continue;
    const paymentTotal = (state: PlatformSnapshot) => state.payments.filter((payment) => payment.caseId === original.id).reduce((sum, payment) => sum + payment.amount, 0);
    const starting = paymentTotal(base);
    if (amountValue(mine.paid) - amountValue(original.paid) !== paymentTotal(local) - starting) continue;
    if (amountValue(theirs.paid) - amountValue(original.paid) !== paymentTotal(remote) - starting) continue;
    snapshot.cases = snapshot.cases.map((item) => item.id === original.id ? { ...item, paid: String(amountValue(original.paid) + paymentTotal(snapshot) - starting) } : item);
    const index = conflicts.indexOf(`cases.${original.id}.paid`);
    if (index >= 0) conflicts.splice(index, 1);
  }
  if (choice !== "report") {
    for (const original of base.cases) {
      const mine = local.cases.find((item) => item.id === original.id);
      const theirs = remote.cases.find((item) => item.id === original.id);
      if (Boolean(mine) === Boolean(theirs) || !conflicts.includes(`cases.${original.id}`)) continue;
      const chosen = choice === "local" ? mine : theirs;
      const deletedSide = mine ? remote : local;
      const newArchive = deletedSide.deletedCases.find((item) => item.case.id === original.id && !base.deletedCases.some((old) => old.case.id === item.case.id && old.deletedTimestamp === item.deletedTimestamp));
      const isNewArchive = (item: PlatformSnapshot["deletedCases"][number]) => Boolean(newArchive && item.case.id === newArchive.case.id && item.deletedTimestamp === newArchive.deletedTimestamp);
      if (chosen) {
        snapshot.cases = [...snapshot.cases.filter((item) => item.id !== original.id), chosen];
        snapshot.deletedCases = snapshot.deletedCases.filter((item) => !isNewArchive(item));
        snapshot.tasks = [...snapshot.tasks.filter((item) => item.caseId !== original.id), ...(choice === "local" ? local.tasks : remote.tasks).filter((item) => item.caseId === original.id)];
        snapshot.alerts = [...snapshot.alerts.filter((item) => item.caseId !== original.id), ...(choice === "local" ? local.alerts : remote.alerts).filter((item) => item.caseId === original.id)];
        snapshot.payments = [...snapshot.payments.filter((item) => item.caseId !== original.id), ...(choice === "local" ? local.payments : remote.payments).filter((item) => item.caseId === original.id)];
        snapshot.documents = [...snapshot.documents.filter((item) => item.caseId !== original.id), ...(choice === "local" ? local.documents : remote.documents).filter((item) => item.caseId === original.id)];
      } else if (newArchive) {
        const edited = mine ?? theirs;
        const archivedCase = edited ? merge(original, mine ? edited : newArchive.case, mine ? newArchive.case : edited, ["deletedCases", original.id, "case"]) as typeof original : newArchive.case;
        const collect = <T extends { id: string; caseId: string }>(active: T[], stored: T[]) => [...new Map([...stored, ...active.filter((item) => item.caseId === original.id)].map((item) => [item.id, item])).values()];
        const archive = {
          ...newArchive,
          case: archivedCase,
          tasks: collect(snapshot.tasks, newArchive.tasks),
          alerts: collect(snapshot.alerts, newArchive.alerts ?? []),
          payments: collect(snapshot.payments, newArchive.payments),
          documents: collect(snapshot.documents, newArchive.documents),
        };
        snapshot.cases = snapshot.cases.filter((item) => item.id !== original.id);
        snapshot.deletedCases = snapshot.deletedCases.map((item) => isNewArchive(item) ? archive : item);
        snapshot.tasks = snapshot.tasks.filter((item) => item.caseId !== original.id);
        snapshot.alerts = snapshot.alerts.filter((item) => item.caseId !== original.id);
        snapshot.payments = snapshot.payments.filter((item) => item.caseId !== original.id);
        snapshot.documents = snapshot.documents.filter((item) => item.caseId !== original.id);
      }
    }
  }
  return { snapshot, conflicts };
}
