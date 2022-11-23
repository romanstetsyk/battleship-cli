import { expect } from "chai";
import { Battleship } from "../core.js";

describe("Battleship class", () => {
  let board;
  beforeEach(() => {
    board = new Battleship();
  });

  it("should be a class Battleship", () => {
    expect(board).to.be.an.instanceOf(Battleship);
  });

  it("should have only given properties", () => {
    expect(board).to.have.all.keys([
      "height",
      "width",
      "allCells",
      "blockedCells",
      "allShips",
      "remainingShips",
      "misses",
      "hits",
      "untouchedCells",
      "gameLost",
    ]);
  });
});
