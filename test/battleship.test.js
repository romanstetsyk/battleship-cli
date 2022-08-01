import { expect } from "chai";
import { Battleship } from "../main.js";

describe("Battleship class", () => {
  it("should be a class Battleship", () => {
    const board = new Battleship();
    expect(board).to.be.an.instanceOf(Battleship);
  });

  it("should have only given properties", () => {
    const board = new Battleship();
    expect(board).to.have.all.keys([
      "height",
      "width",
      "allCells",
      "blockedCells",
      "ships",
      "availShips",
      "misses",
      "hits",
      "untouchedCells",
      "gameLost",
    ]);
  });
});
