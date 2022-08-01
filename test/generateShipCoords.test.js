import { expect } from "chai";
import { Battleship } from "../main.js";

describe("generateShipCoords method", () => {
  describe("randomly placed ships", () => {
    it("should return an array of coordinates", () => {
      const board = new Battleship();
      board.initializeBoardSize(10, 10);
      expect(board.generateShipCoords(5)).to.be.instanceOf(Array);
    });

    it("should return an array of size of the ship", () => {
      const board = new Battleship();
      board.initializeBoardSize(10, 10);
      for (let i = 1; i <= 10; i += 1) {
        expect(board.generateShipCoords(i)).to.have.lengthOf(i);
      }
    });

    it("should return valid ship", () => {
      const board = new Battleship();
      board.initializeBoardSize(10, 10);
      board.generateShipCoords(5);
    });
  });

  describe("manually placed ships", () => {
    it("should return valid ship", () => {
      const board = new Battleship();
      board.initializeBoardSize(10, 10);
      expect(
        board.generateShipCoords(3, {
          direction: "horizontal",
          startingCell: "A1",
        })
      ).to.deep.equal(["A1", "A2", "A3"]);
    });

    it("should return valid ship", () => {
      const board = new Battleship();
      board.initializeBoardSize(5, 5);
      expect(
        board.generateShipCoords(3, {
          direction: "vertical",
          startingCell: "B2",
        })
      ).to.deep.equal(["B2", "C2", "D2"]);
    });
  });
});
