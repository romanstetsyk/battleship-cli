import assert from "node:assert";
import { Battleship } from "../src/core.js";
import { beforeEach, describe, it } from "node:test";
import { Direction } from "../src/types.js";

describe("possibleShipStartingCells method", () => {
  let board: Battleship;
  beforeEach(() => {
    board = new Battleship();
  });

  it("should return an array", () => {
    board.initializeBoardSize(5, 5);
    board.blockedCells.push("C3");
    assert.ok(
      Array.isArray(board.possibleShipStartingCells(5, Direction.VERTICAL))
    );
  });

  it("test 5x5 board with one cell blocked", () => {
    board.initializeBoardSize(5, 5);
    board.blockedCells.push("C3");
    const output = ["A1", "B1", "D1", "E1"];
    assert.deepStrictEqual(
      board.possibleShipStartingCells(5, Direction.VERTICAL),
      output
    );
  });

  it("shoud throw error if ship size is greater than board dimention", () => {
    board.initializeBoardSize(5, 5);
    const size = 6;
    assert.throws(
      () => board.possibleShipStartingCells(size, Direction.VERTICAL),
      new Error(`Not enough space for a ship size ${size}`)
    );
  });

  it("shoud throw error if ship can't be placed due to blocked cells", () => {
    board.initializeBoardSize(5, 5);
    board.blockedCells.push("C1", "C2", "C3", "C4", "C5");
    const size = 3;
    assert.throws(
      () => board.possibleShipStartingCells(size, Direction.HORIZONTAL),
      new Error(`Not enough space for a ship size ${size}`)
    );
  });

  it("should work with 5x5 board with blocked cells", () => {
    board.initializeBoardSize(5, 5);
    board.blockedCells.push("C3", "A4", "E3");
    // prettier-ignore
    const output = ["A1", "A2", "A5", "B1", "B2", "B4", "B5", "C1", "C2", "C4", "C5"];
    assert.deepStrictEqual(
      board.possibleShipStartingCells(3, Direction.HORIZONTAL),
      output
    );
  });

  it("should work with 5x5 board with no cell blocked", () => {
    board.initializeBoardSize(5, 5);
    const output = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2"];
    assert.deepStrictEqual(
      board.possibleShipStartingCells(4, Direction.VERTICAL),
      output
    );
  });

  it("should work with ships of size 1", () => {
    board.initializeBoardSize(10, 10);
    const cell1 = "B3";
    const cell2 = "C3";
    board.blockedCells.push(cell1, cell2);
    const output = board.allCells.filter((c) => c !== cell1 && c !== cell2);
    assert.deepStrictEqual(
      board.possibleShipStartingCells(1, Direction.VERTICAL).length,
      output.length
    );
  });
});
