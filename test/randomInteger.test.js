import { expect } from "chai";
import { Battleship } from "../main.js";
import { randomInteger } from "../helpers.js";

describe("randomInteger", () => {
  it("should return an integer", () => {
    for (let i = 0; i < 1000; i += 1) {
      expect(randomInteger(i)).to.satisfy(Number.isInteger);
    }
  });

  it("should return a number between 0 and i inclusive, when the input is i", () => {
    for (let i = 0; i < 100; i += 1) {
      expect(randomInteger(i)).to.be.at.least(0).but.at.most(i);
    }
  });
});
