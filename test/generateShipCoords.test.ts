import assert from "node:assert";
import { Battleship } from "../src/core.js";
import { beforeEach, describe, it } from "node:test";
import { Direction } from "../src/types.js";

describe("generateShipCoords method", () => {
  let board: Battleship;
  beforeEach(() => {
    board = new Battleship();
    board.initializeBoardSize(10, 10);
  });

  describe("randomly placed ships", () => {
    it("should return a set of coordinates", () => {
      assert.ok(
        board.generateShipCoords(3, "A3", Direction.HORIZONTAL) instanceof Set
      );
    });

    it("should return a set of size of the ship", () => {
      for (let i = 1; i <= 5; i += 1) {
        const ship = board.generateShipCoords(i, "A1", Direction.VERTICAL);
        assert.strictEqual(ship.size, i);
      }
    });
  });

  describe.only("manually placed ships", () => {
    it("should return valid horizontal ship", () => {
      assert.deepStrictEqual(
        board.generateShipCoords(3, "A1", Direction.HORIZONTAL),
        new Set(["A1", "B1", "C1"])
      );
    });

    it("should return valid vertical ship", () => {
      assert.deepStrictEqual(
        board.generateShipCoords(3, "B2", Direction.VERTICAL),
        new Set(["B2", "B3", "B4"])
      );
    });
  });
});
