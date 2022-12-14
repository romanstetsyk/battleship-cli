import { expect } from "chai";
import { Battleship } from "../core.js";

describe("generateShipCoords method", () => {
  let board;
  beforeEach(() => {
    board = new Battleship();
  });

  describe("randomly placed ships", () => {
    it("should return a set of coordinates", () => {
      board.initializeBoardSize(10, 10);
      expect(board.generateShipCoords(5)).to.be.instanceOf(Set);
    });

    it("should return a set of size of the ship", () => {
      board.initializeBoardSize(10, 10);
      for (let i = 1; i <= 10; i += 1) {
        expect(board.generateShipCoords(i)).to.have.lengthOf(i);
      }
    });

    it("should return valid ship", () => {
      board.initializeBoardSize(10, 10);
      board.generateShipCoords(5);
    });
  });

  describe("manually placed ships", () => {
    it("should return valid ship", () => {
      board.initializeBoardSize(10, 10);
      expect(
        board.generateShipCoords(3, {
          direction: "horizontal",
          startingCell: "A1",
        })
      ).to.deep.equal(new Set(["A1", "A2", "A3"]));
    });

    it("should return valid ship", () => {
      board.initializeBoardSize(5, 5);
      expect(
        board.generateShipCoords(3, {
          direction: "vertical",
          startingCell: "B2",
        })
      ).to.deep.equal(new Set(["B2", "C2", "D2"]));
    });
  });
});
