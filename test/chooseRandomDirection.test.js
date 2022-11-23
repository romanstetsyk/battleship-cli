import { expect } from "chai";
import { chooseRandomDirection } from "../helpers.js";

describe("chooseRandomDirection", () => {
  it("should return a string", () => {
    for (let i = 0; i < 100; i += 1) {
      expect(chooseRandomDirection()).to.be.a("string");
    }
  });

  it("should return either 'horizontal' or 'vertical'", () => {
    for (let i = 0; i < 100; i += 1) {
      expect(chooseRandomDirection()).to.be.oneOf(["horizontal", "vertical"]);
    }
  });
});
