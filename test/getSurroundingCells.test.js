import { expect } from "chai";
import { Battleship } from "../main.js";

describe("getSurroundingCells method", () => {
  let board;
  beforeEach(() => {
    board = new Battleship();
  });

  it("should return an array", () => {
    board.initializeBoardSize(10, 10);
    expect(board.getSurroundingCells("C4")).to.be.instanceOf(Array);
  });

  it("should throw an error if element is our of range", () => {
    board.initializeBoardSize(5, 5);
    expect(() => board.getSurroundingCells("J8")).to.throw("is out of range");
  });

  it("should return A1,A2,B1 for input A1", () => {
    board.initializeBoardSize(10, 10);
    expect(board.getSurroundingCells("A1")).to.have.same.members([
      "B1",
      "A1",
      "A2",
    ]);
  });

  it("should return A1,A2,B1,B2 for input A1 if corners are included", () => {
    board.initializeBoardSize(10, 10);
    expect(board.getSurroundingCells("A1", true)).to.have.same.members([
      "B1",
      "A1",
      "A2",
      "B2",
    ]);
  });
});
