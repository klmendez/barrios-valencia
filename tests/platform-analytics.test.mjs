import assert from "node:assert/strict";
import test from "node:test";
import { amountValue, summarizeCaseFinance } from "../src/lib/platform-analytics.ts";

test("groups agreed fees and collected payments by case type", () => {
  const cases = [
    { id: "BV-1", type: "Pensión", counterparty: "Colpensiones", fees: "$4.000.000", paid: "$2.000.000" },
    { id: "BV-2", type: "Pensión", counterparty: "UGPP", fees: "$3.000.000", paid: "$1.000.000" },
    { id: "BV-3", type: "Laboral", counterparty: "UGPP", fees: "$5.000.000", paid: "$4.000.000" },
  ];
  const payments = [{ caseId: "BV-1", amount: 1_000_000 }, { caseId: "BV-1", amount: 1_000_000 }, { caseId: "BV-3", amount: 4_000_000 }];

  assert.deepEqual(summarizeCaseFinance(cases, payments, "type"), [
    { name: "Laboral", count: 1, fees: 5_000_000, paid: 4_000_000, balance: 1_000_000, averagePaid: 4_000_000, paymentCount: 1 },
    { name: "Pensión", count: 2, fees: 7_000_000, paid: 3_000_000, balance: 4_000_000, averagePaid: 1_500_000, paymentCount: 2 },
  ]);
  assert.equal(summarizeCaseFinance(cases, payments, "counterparty")[0].name, "UGPP");
});

test("a newly created case appears in its type even before fees or payments", () => {
  const summary = summarizeCaseFinance([{ id: "BV-new", type: "Nuevo proceso", counterparty: "Otra", fees: "", paid: "" }], [], "type");
  assert.equal(summary[0].count, 1);
  assert.equal(summary[0].paid, 0);
  assert.equal(summary[0].paymentCount, 0);
  assert.equal(amountValue("$1.250.000"), 1_250_000);
});
