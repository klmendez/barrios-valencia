import assert from "node:assert/strict";
import test from "node:test";
import { baseCaseColumnIds, moveCaseColumn, resolveCaseColumnOrder } from "../src/lib/platform-case-columns.ts";

test("column order survives added and removed custom columns", () => {
  const moved = moveCaseColumn([...baseCaseColumnIds, "CF-1"], "CF-1", "client");
  assert.equal(moved[0], "CF-1");
  assert.deepEqual(resolveCaseColumnOrder(moved, ["CF-1", "CF-2"]), [...moved, "CF-2"]);
  assert.deepEqual(resolveCaseColumnOrder(moved, ["CF-2"]), [...moved.filter((id) => id !== "CF-1"), "CF-2"]);
});

test("dragging a column one place to the right changes its position", () => {
  assert.deepEqual(moveCaseColumn(["client", "status", "paid"], "client", "status"), ["status", "client", "paid"]);
  assert.deepEqual(moveCaseColumn(["client", "status", "paid"], "paid", "client"), ["paid", "client", "status"]);
});
