import assert from "node:assert/strict";
import test from "node:test";
import { initialPlatformSnapshot } from "../src/lib/platform-defaults.ts";
import { mergeConcurrentSnapshots } from "../src/lib/platform-concurrent-merge.ts";
import { archiveDeletedCase } from "../src/lib/platform-case-deletion.ts";

const original = { id: "BV-1", client: "ANA", phone: "111", status: "Pendiente", history: [] };
const base = { ...initialPlatformSnapshot, cases: [original] };

test("merges independent edits to one case and additions from both users", () => {
  const local = { ...base, cases: [{ ...original, phone: "222" }], tasks: [{ id: "T-1", caseId: "BV-1" }] };
  const remote = { ...base, cases: [{ ...original, status: "Esperando" }], alerts: [{ id: "A-1", caseId: "BV-1" }] };
  const result = mergeConcurrentSnapshots(base, local, remote);
  assert.deepEqual(result.conflicts, []);
  assert.equal(result.snapshot.cases[0].phone, "222");
  assert.equal(result.snapshot.cases[0].status, "Esperando");
  assert.equal(result.snapshot.tasks.length, 1);
  assert.equal(result.snapshot.alerts.length, 1);
});

test("reports same-field conflicts and resolves only that field by choice", () => {
  const local = { ...base, cases: [{ ...original, phone: "222" }] };
  const remote = { ...base, cases: [{ ...original, phone: "333", status: "Esperando" }] };
  const review = mergeConcurrentSnapshots(base, local, remote);
  assert.deepEqual(review.conflicts, ["cases.BV-1.phone"]);
  assert.equal(mergeConcurrentSnapshots(base, local, remote, "local").snapshot.cases[0].phone, "222");
  assert.equal(mergeConcurrentSnapshots(base, local, remote, "remote").snapshot.cases[0].phone, "333");
  assert.equal(review.snapshot.cases[0].status, "Esperando");
});

test("adds concurrent payments without losing either amount", () => {
  const starting = { ...base, cases: [{ ...original, paid: "500" }], payments: [{ id: "P-0", caseId: "BV-1", amount: 100 }] };
  const local = { ...starting, cases: [{ ...original, paid: "700" }], payments: [...starting.payments, { id: "P-1", caseId: "BV-1", amount: 200 }] };
  const remote = { ...starting, cases: [{ ...original, paid: "800" }], payments: [...starting.payments, { id: "P-2", caseId: "BV-1", amount: 300 }] };
  const result = mergeConcurrentSnapshots(starting, local, remote);
  assert.deepEqual(result.conflicts, []);
  assert.equal(result.snapshot.cases[0].paid, "1000");
  assert.equal(result.snapshot.payments.length, 3);
});

test("does not silently restore a case deleted while another user edited it", () => {
  const withTask = { ...base, tasks: [{ id: "T-1", caseId: "BV-1" }] };
  const local = archiveDeletedCase(withTask, "BV-1", "Juan Valencia", new Date("2026-10-10T12:00:00Z"));
  const remote = { ...withTask, cases: [{ ...original, phone: "333" }] };
  assert.deepEqual(mergeConcurrentSnapshots(withTask, local, remote).conflicts, ["cases.BV-1"]);
  const keepRemote = mergeConcurrentSnapshots(withTask, local, remote, "remote").snapshot;
  assert.equal(keepRemote.cases[0].phone, "333");
  assert.equal(keepRemote.deletedCases.length, 0);
  assert.deepEqual(keepRemote.tasks.map((item) => item.id), ["T-1"]);
  const keepLocal = mergeConcurrentSnapshots(withTask, local, remote, "local").snapshot;
  assert.equal(keepLocal.cases.length, 0);
  assert.equal(keepLocal.deletedCases[0].tasks.length, 1);
  assert.equal(keepLocal.tasks.length, 0);
});
