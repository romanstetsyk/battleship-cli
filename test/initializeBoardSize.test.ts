import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';
import { Battleship } from '../src/core.js';

describe('initializeBoardSize(h, w)', () => {
  const minDimention = 5;
  const maxDimention = 26;
  const cellNameRegexp = /^[A-Z]{1}\d{1,2}$/;

  let board: Battleship;
  beforeEach(() => {
    board = new Battleship();
  });

  it('should throw an error if height or width is not an integer', () => {
    assert.throws(
      () => board.initializeBoardSize(2.5, 'a' as unknown as number),
      new Error('Height and width must be integers'),
    );
    assert.throws(
      () => board.initializeBoardSize(6, 20.1),
      new Error('Height and width must be integers'),
    );
  });

  it('should throw an error if height or width are not between 5 and 25 inclusive', () => {
    assert(
      () => board.initializeBoardSize(2, 10),
      new Error('Height and width must be between 5 and 26 inclusive'),
    );
    assert(
      () => board.initializeBoardSize(10, 4),
      new Error('Height and width must be between 5 and 26 inclusive'),
    );
    assert(
      () => board.initializeBoardSize(30, 29),
      new Error('Height and width must be between 5 and 26 inclusive'),
    );
  });

  it(`should set the width of the board`, () => {
    for (let i = minDimention; i <= maxDimention; i += 1) {
      board = new Battleship();
      board.initializeBoardSize(i, i);
      assert.strictEqual(board.width, i);
    }
  });

  it(`should set the height of the board`, () => {
    for (let i = minDimention; i <= maxDimention; i += 1) {
      board = new Battleship();
      board.initializeBoardSize(i, i);
      assert.strictEqual(board.width, i);
    }
  });

  it('should set allCells property to be an array', () => {
    board.initializeBoardSize(10, 10);
    assert.strictEqual(Array.isArray(board.allCells), true);
  });

  it('should set untouchedCells property to be an array', () => {
    board.initializeBoardSize(10, 10);
    assert.strictEqual(board.untouchedCells instanceof Set, true);
  });

  it('should set allCells property length to equal width * height', () => {
    board.initializeBoardSize(5, 14);
    assert.strictEqual(board.allCells.length, 5 * 14);
  });

  it('should set untouchedCells property length to equal width * height', () => {
    board.initializeBoardSize(6, 12);
    assert.strictEqual(board.untouchedCells.size, 6 * 12);
  });

  it('allCells elements should start with letter and end with number (e.g. J20)', () => {
    for (let i = minDimention; i <= maxDimention; i += 1) {
      const board = new Battleship();
      board.initializeBoardSize(i, i);
      assert.ok(board.allCells.every((e) => cellNameRegexp.test(e)));
    }
  });

  it('untouchedCells elements should start with letter and end with number (e.g. J20)', () => {
    for (let i = minDimention; i <= maxDimention; i += 1) {
      const board = new Battleship();
      board.initializeBoardSize(i, i);
      assert.ok([...board.untouchedCells].every((e) => cellNameRegexp.test(e)));
    }
  });
});
