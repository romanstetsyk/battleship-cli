import { describe, it } from "node:test";
import { xDifferByOne } from "../src/helpers.js";
import assert from "node:assert";

describe("xDifferByOne", () => {
  it("should throw if array is empty", () => {
    assert.throws(() => xDifferByOne([]), new Error("Array can't be empty"));
  });

  it("should return true for array length 1", () => {
    assert.ok(xDifferByOne(["c"]));
    assert.ok(xDifferByOne(["J"]));
  });

  it("should work for array length > 1", () => {
    assert.ok(xDifferByOne(["A", "B"]));
    assert.ok(xDifferByOne(["c", "d", "e"]));
    assert.ok(xDifferByOne(["B", "C", "D", "E", "F", "G", "H", "I", "J"]));
    assert.strictEqual(xDifferByOne(["D", "E", "F", "G", "h"]), false);
    assert.strictEqual(xDifferByOne(["D", "E", "G"]), false);
  });

  it("should throw if elements are not in accending order", () => {
    assert.strictEqual(xDifferByOne(["C", "B", "A"]), false);
  });
});
