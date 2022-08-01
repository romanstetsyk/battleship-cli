import { assert, expect } from "chai";
import { Board } from "../main.js";

const board = new Board();

describe("randomInteger", () => {
  it("should return an integer", () => {
    for (let i = 0; i < 1000; i += 1) {
      expect(board.randomInteger(i)).to.satisfy(Number.isInteger);
    }
  });

  it("should return a number between 0 and i inclusive, when the input is i", () => {
    for (let i = 0; i < 100; i += 1) {
      expect(board.randomInteger(i)).to.be.at.least(0).but.at.most(i);
    }
  });
});
