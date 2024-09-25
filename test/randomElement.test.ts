import { describe, it } from "node:test";
import { randomElement } from "../src/helpers.js";
import assert from "node:assert";

const count = 100_000;
describe("randomElement", () => {
  it("should produce uniform distribution", () => {
    const tally = { a: 0, b: 0 };
    const keys = Object.keys(tally);
    for (let i = 0; i < count; i += 1) {
      const x = randomElement(Object.keys(tally));
      tally[x]++;
    }
    for (const key of keys) {
      assert.ok(Math.abs(tally[key] / count - 1 / keys.length) < 0.01);
    }
  });

  it("should produce uniform distribution", () => {
    const tally = { a: 0, b: 0, c: 0 };
    const keys = Object.keys(tally);
    for (let i = 0; i < count; i += 1) {
      const elem = randomElement(keys);
      tally[elem]++;
    }
    for (const key of keys) {
      assert.ok(Math.abs(tally[key] / count - 1 / keys.length) < 0.01);
    }
  });

  it("should produce uniform distribution", () => {
    const tally = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 };
    const keys = Object.keys(tally);
    for (let i = 0; i < count; i += 1) {
      const elem = randomElement(keys);
      tally[elem]++;
    }
    for (const key of keys) {
      assert.ok(Math.abs(tally[key] / count - 1 / keys.length) < 0.01);
    }
  });
});
