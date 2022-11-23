import { expect } from "chai";
import { Battleship } from "../core.js";

describe("possibleShipStartingCells method", () => {
  let board;
  beforeEach(() => {
    board = new Battleship();
  });

  it("should return an array", () => {
    board.initializeBoardSize(5, 5);
    board.blockedCells.push("C3");
    expect(board.possibleShipStartingCells(5, "vertical")).to.be.instanceOf(
      Array
    );
  });

  it("test 5x5 board with one cell blocked", () => {
    board.initializeBoardSize(5, 5);
    board.blockedCells.push("C3");
    expect(board.possibleShipStartingCells(5, "vertical")).to.deep.equal([
      "A1",
      "A2",
      "A4",
      "A5",
    ]);
  });

  it("shoud throw error if ship can't be placed", () => {
    board.initializeBoardSize(5, 5);
    expect(() => board.possibleShipStartingCells(6, "vertical")).to.throw(
      "Not enough space for a ship size"
    );
  });

  it("test 10x10 board with 5 cells blocked", () => {
    board.initializeBoardSize(10, 10);
    board.blockedCells.push("C3", "A5", "J4", "F10", "D2");
    expect(board.possibleShipStartingCells(5, "horizontal")).to.deep.equal([
      "A6",
      "B1",
      "B2",
      "B3",
      "B4",
      "B5",
      "B6",
      "C4",
      "C5",
      "C6",
      "D3",
      "D4",
      "D5",
      "D6",
      "E1",
      "E2",
      "E3",
      "E4",
      "E5",
      "E6",
      "F1",
      "F2",
      "F3",
      "F4",
      "F5",
      "G1",
      "G2",
      "G3",
      "G4",
      "G5",
      "G6",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "I1",
      "I2",
      "I3",
      "I4",
      "I5",
      "I6",
      "J5",
      "J6",
    ]);
  });

  it("test 5x5 board with no cell blocked", () => {
    board.initializeBoardSize(5, 5);
    expect(board.possibleShipStartingCells(4, "horizontal")).to.deep.equal([
      "A1",
      "A2",
      "B1",
      "B2",
      "C1",
      "C2",
      "D1",
      "D2",
      "E1",
      "E2",
    ]);
  });
});
