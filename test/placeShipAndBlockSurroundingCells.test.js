import { expect } from "chai";
import { Battleship } from "../main.js";

describe("placeShipAndBlockSurroundingCells method", () => {
  let board;
  beforeEach(() => {
    board = new Battleship();
  });

  it("should add array to allShips property", () => {
    board.initializeBoardSize(10, 10);
    board.placeShipAndBlockSurroundingCells(["A1", "A2", "A3"]);
    expect(board.allShips).to.deep.equal([["A1", "A2", "A3"]]);
  });

  it("should add array to remainingShips property", () => {
    board.initializeBoardSize(10, 10);
    board.placeShipAndBlockSurroundingCells(["A1", "A2", "A3"], true);
    expect(board.remainingShips).to.deep.equal([["A1", "A2", "A3"]]);
  });

  it("should block cells including corners", () => {
    board.initializeBoardSize(10, 10);
    board.placeShipAndBlockSurroundingCells(["A1", "A2", "A3"], true);
    expect(board.blockedCells).to.have.same.members([
      "A1",
      "A2",
      "A3",
      "A4",
      "B1",
      "B2",
      "B3",
      "B4",
    ]);
  });

  it("should block cells excluding corners", () => {
    board.initializeBoardSize(10, 10);
    board.placeShipAndBlockSurroundingCells(["A1", "A2", "A3"]);
    expect(board.blockedCells).to.have.same.members([
      "A1",
      "A2",
      "A3",
      "A4",
      "B1",
      "B2",
      "B3",
    ]);
  });
});
