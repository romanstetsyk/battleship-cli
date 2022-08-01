import { expect } from "chai";
import { Battleship } from "../main.js";

describe("getSurroundingCells method", () => {
  it("should return an array", () => {
    const board = new Battleship();
    board.initializeBoardSize(10, 10);
    expect(board.getSurroundingCells("C4")).to.be.instanceOf(Array);
  });

  it("should throw an error if element is our of range", () => {
    const board = new Battleship();
    board.initializeBoardSize(5, 5);
    expect(() => board.getSurroundingCells("J8")).to.throw("is out of range");
  });

  it("should return A1,A2,B1 for input A1", () => {
    const board = new Battleship();
    board.initializeBoardSize(10, 10);
    expect(board.getSurroundingCells("A1")).to.have.same.members([
      "B1",
      "A1",
      "A2",
    ]);
  });

  it("should return A1,A2,B1,B2 for input A1 if corners are included", () => {
    const board = new Battleship();
    board.initializeBoardSize(10, 10);
    expect(board.getSurroundingCells("A1", true)).to.have.same.members([
      "B1",
      "A1",
      "A2",
      "B2",
    ]);
  });
});
