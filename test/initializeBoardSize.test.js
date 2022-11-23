import { expect } from "chai";
import { Battleship } from "../core.js";

describe("initializeBoardSize(h, w)", () => {
  const minDimention = 5;
  const maxDimention = 26;

  it("should throw an error if height or width is not an integer", () => {
    const board = new Battleship();
    expect(() => board.initializeBoardSize(2.5, "a")).to.throw(
      "Height and width must be integers"
    );
    expect(() => board.initializeBoardSize(6, 20.1)).to.throw(
      "Height and width must be integers"
    );
  });

  it("should throw an error if height or width are not between 5 and 25 inclusive", () => {
    const board = new Battleship();
    expect(() => board.initializeBoardSize(2, 10)).to.throw(
      "Height and width must be between 5 and 26 inclusive"
    );
    expect(() => board.initializeBoardSize(10, 4)).to.throw(
      "Height and width must be between 5 and 26 inclusive"
    );
    expect(() => board.initializeBoardSize(30, 29)).to.throw(
      "Height and width must be between 5 and 26 inclusive"
    );
  });

  it("should set the width of w", () => {
    for (let i = minDimention; i <= maxDimention; i += 1) {
      const board = new Battleship();
      board.initializeBoardSize(i, i);
      expect(board.width).to.equal(i);
    }
  });

  it("should set the height of h", () => {
    for (let i = minDimention; i <= maxDimention; i += 1) {
      const board = new Battleship();
      board.initializeBoardSize(i, i);
      expect(board.height).to.equal(i);
    }
  });

  it("should set allCells property to be an array", () => {
    for (let i = minDimention; i <= maxDimention; i += 1) {
      const board = new Battleship();
      board.initializeBoardSize(i, i);
      expect(board.allCells).to.be.instanceOf(Array);
    }
  });

  it("should set untouchedCells property to be an array", () => {
    for (let i = minDimention; i <= maxDimention; i += 1) {
      const board = new Battleship();
      board.initializeBoardSize(i, i);
      expect(board.untouchedCells).to.be.instanceOf(Array);
    }
  });

  it("should set allCells property length to equal width * height", () => {
    for (let i = minDimention; i <= maxDimention; i += 1) {
      const board = new Battleship();
      board.initializeBoardSize(i, i);
      expect(board.allCells.length).to.equal(i * i);
    }
  });

  it("should set untouchedCells property length to equal width * height", () => {
    for (let i = minDimention; i <= maxDimention; i += 1) {
      const board = new Battleship();
      board.initializeBoardSize(i, i);
      expect(board.untouchedCells.length).to.equal(i * i);
    }
  });

  it("allCells elements should start with letter and end with number (e.g. J20)", () => {
    for (let i = minDimention; i <= maxDimention; i += 1) {
      const board = new Battleship();
      board.initializeBoardSize(i, i);
      expect(board.allCells.every(e => /^[A-Z]\d{1,2}$/.test(e))).to.be.true;
    }
  });

  it("untouchedCells elements should start with letter and end with number (e.g. J20)", () => {
    for (let i = minDimention; i <= maxDimention; i += 1) {
      const board = new Battleship();
      board.initializeBoardSize(i, i);
      expect(board.untouchedCells.every(e => /^[A-Z]\d{1,2}$/.test(e))).to.be
        .true;
    }
  });
});
