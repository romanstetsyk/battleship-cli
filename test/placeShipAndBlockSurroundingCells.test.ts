import { beforeEach, describe, it } from "node:test";
import assert from "node:assert";
import { Battleship } from "../src/core.js";
import type { Cell } from "../src/types.js";

describe("placeShipAndBlockSurroundingCells", () => {
  let board: Battleship;
  beforeEach(() => {
    board = new Battleship();
  });

  it("should add array to allShips property", () => {
    board.initializeBoardSize(10, 10);
    const coords: Cell[] = ["A1", "A2", "A3"];
    board.placeShipAndBlockSurroundingCells(new Set(coords));
    assert.deepStrictEqual(board.allShips, [new Set(coords)]);
  });

  it("should add array to remainingShips property", () => {
    board.initializeBoardSize(10, 10);
    const coords: Cell[] = ["A1", "A2", "A3"];
    board.placeShipAndBlockSurroundingCells(new Set(coords), true);
    assert.deepStrictEqual(board.remainingShips, [new Set(coords)]);
  });

  it("should block cells including corners", () => {
    board.initializeBoardSize(10, 10);
    const coords: Cell[] = ["A1", "A2", "A3"];
    const blocked = ["A1", "B1", "A2", "B2", "A3", "B3", "A4", "B4"];
    board.placeShipAndBlockSurroundingCells(new Set(coords), true);
    assert.deepStrictEqual(board.blockedCells, blocked);
  });

  it("should block cells excluding corners", () => {
    board.initializeBoardSize(10, 10);
    const coords: Cell[] = ["A1", "A2", "A3"];
    const blocked = ["A1", "B1", "A2", "B2", "A3", "B3", "A4"];
    board.placeShipAndBlockSurroundingCells(new Set(coords));
    assert.deepStrictEqual(board.blockedCells, blocked);
  });

  it("should block cells for two ships without corners", () => {
    board.initializeBoardSize(10, 10);
    const coords1: Cell[] = ["A1", "A2", "A3"];
    const coords2: Cell[] = ["C2"];
    // prettier-ignore
    const blocked = ["A1", "B1", "A2", "B2", "A3", "B3", "A4", "C2", "D2", "C1", "C3"];
    board.placeShipAndBlockSurroundingCells(new Set(coords1));
    board.placeShipAndBlockSurroundingCells(new Set(coords2));
    assert.deepStrictEqual(board.blockedCells.toString(), blocked.toString());
  });

  it("should block cells for two ships with corners", () => {
    board.initializeBoardSize(10, 10);
    const coords1: Cell[] = ["A1", "A2", "A3"];
    const coords2: Cell[] = ["C2"];
    // prettier-ignore
    const blocked = ["A1", "B1", "A2", "B2", "A3", "B3", "A4", "B4", "C2", "D2", "C1", "C3", "D1", "D3"];
    board.placeShipAndBlockSurroundingCells(new Set(coords1), true);
    board.placeShipAndBlockSurroundingCells(new Set(coords2), true);
    assert.deepStrictEqual(board.blockedCells.toString(), blocked.toString());
  });
});
