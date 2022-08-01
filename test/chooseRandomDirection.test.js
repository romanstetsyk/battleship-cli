import { expect } from "chai";
import { Board } from "../main.js";

const board = new Board();

describe("chooseRandomDirection", () => {
  it("should return a string", () => {
    for (let i = 0; i < 100; i += 1) {
      expect(board.chooseRandomDirection()).to.be.a("string");
    }
  });

  it("should return either 'horizontal' or 'vertical'", () => {
    for (let i = 0; i < 100; i += 1) {
      expect(board.chooseRandomDirection()).to.be.oneOf([
        "horizontal",
        "vertical",
      ]);
    }
  });
});
