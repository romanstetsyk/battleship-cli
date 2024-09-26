import { Battleship } from '../src/core.js';
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';
import { Cell, Position } from '../src/types.js';

let board: Battleship;
beforeEach(() => {
  board = new Battleship();
});

describe('getSurroundingCells for square boards', () => {
  it('should return an array', () => {
    board.initializeBoardSize(10, 10);
    assert.ok(board.getSurroundingCells('C4') instanceof Map);
  });

  it('should throw an error if element is our of range', () => {
    const [w, h] = [5, 5];
    const cell = 'J8';
    board.initializeBoardSize(h, w);
    assert.throws(
      () => board.getSurroundingCells(cell),
      new Error(`Element ${cell} is out of range on a ${h}x${w} board`),
    );
  });

  it('should work for A1 without corners', () => {
    board.initializeBoardSize(10, 10);
    const t = {
      cell: 'A1' as Cell,
      output: new Map([
        [Position.CENTER, 'A1'],
        [Position.RIGHT, 'B1'],
        [Position.DOWN, 'A2'],
      ]),
    };
    assert.deepStrictEqual(board.getSurroundingCells(t.cell), t.output);
  });

  it('should work for A1 with corners', () => {
    board.initializeBoardSize(10, 10);
    const t = {
      cell: 'A1' as Cell,
      corners: true,
      output: new Map([
        [Position.CENTER, 'A1'],
        [Position.RIGHT, 'B1'],
        [Position.DOWN, 'A2'],
        [Position.DOWNRIGHT, 'B2'],
      ]),
    };
    assert.deepStrictEqual(
      board.getSurroundingCells(t.cell, t.corners),
      t.output,
    );
  });

  it('should work for A4 without corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'A4' as Cell,
      output: new Map([
        [Position.CENTER, 'A4'],
        [Position.UP, 'A3'],
        [Position.DOWN, 'A5'],
        [Position.RIGHT, 'B4'],
      ]),
    };
    assert.deepStrictEqual(board.getSurroundingCells(c.cell), c.output);
  });

  it('should work for A4 with corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'A4' as Cell,
      corners: true,
      output: new Map([
        [Position.CENTER, 'A4'],
        [Position.UP, 'A3'],
        [Position.DOWN, 'A5'],
        [Position.RIGHT, 'B4'],
        [Position.UPRIGHT, 'B3'],
        [Position.DOWNRIGHT, 'B5'],
      ]),
    };
    assert.deepStrictEqual(
      board.getSurroundingCells(c.cell, c.corners),
      c.output,
    );
  });

  it('should work for A10 without corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'A10' as Cell,
      outptut: new Map([
        [Position.CENTER, 'A10'],
        [Position.RIGHT, 'B10'],
        [Position.UP, 'A9'],
      ]),
    };
    assert.deepStrictEqual(board.getSurroundingCells(c.cell), c.outptut);
  });

  it('should work for A10 with corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'A10' as Cell,
      corner: true,
      outptut: new Map([
        [Position.CENTER, 'A10'],
        [Position.RIGHT, 'B10'],
        [Position.UP, 'A9'],
        [Position.UPRIGHT, 'B9'],
      ]),
    };
    assert.deepStrictEqual(
      board.getSurroundingCells(c.cell, c.corner),
      c.outptut,
    );
  });

  it('should work for C1 without corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'C1' as Cell,
      outptut: new Map([
        [Position.CENTER, 'C1'],
        [Position.LEFT, 'B1'],
        [Position.RIGHT, 'D1'],
        [Position.DOWN, 'C2'],
      ]),
    };
    assert.deepStrictEqual(board.getSurroundingCells(c.cell), c.outptut);
  });

  it('should work for C1 with corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'C1' as Cell,
      corners: true,
      outptut: new Map([
        [Position.CENTER, 'C1'],
        [Position.LEFT, 'B1'],
        [Position.RIGHT, 'D1'],
        [Position.DOWN, 'C2'],
        [Position.DOWNLEFT, 'B2'],
        [Position.DOWNRIGHT, 'D2'],
      ]),
    };
    assert.deepStrictEqual(
      board.getSurroundingCells(c.cell, c.corners),
      c.outptut,
    );
  });

  it('should work for B3 without corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'B3' as Cell,
      outptut: new Map([
        [Position.CENTER, 'B3'],
        [Position.LEFT, 'A3'],
        [Position.RIGHT, 'C3'],
        [Position.UP, 'B2'],
        [Position.DOWN, 'B4'],
      ]),
    };
    assert.deepStrictEqual(board.getSurroundingCells(c.cell), c.outptut);
  });

  it('should work for B3 with corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'B3' as Cell,
      corner: true,
      outptut: new Map([
        [Position.CENTER, 'B3'],
        [Position.LEFT, 'A3'],
        [Position.RIGHT, 'C3'],
        [Position.UP, 'B2'],
        [Position.DOWN, 'B4'],
        [Position.UPLEFT, 'A2'],
        [Position.UPRIGHT, 'C2'],
        [Position.DOWNLEFT, 'A4'],
        [Position.DOWNRIGHT, 'C4'],
      ]),
    };
    assert.deepStrictEqual(
      board.getSurroundingCells(c.cell, c.corner),
      c.outptut,
    );
  });

  it('should work for E10 without corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'E10' as Cell,
      outptut: new Map([
        [Position.CENTER, 'E10'],
        [Position.LEFT, 'D10'],
        [Position.RIGHT, 'F10'],
        [Position.UP, 'E9'],
      ]),
    };
    assert.deepStrictEqual(board.getSurroundingCells(c.cell), c.outptut);
  });

  it('should work for E10 with corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'E10' as Cell,
      corners: true,
      outptut: new Map([
        [Position.CENTER, 'E10'],
        [Position.LEFT, 'D10'],
        [Position.RIGHT, 'F10'],
        [Position.UP, 'E9'],
        [Position.UPLEFT, 'D9'],
        [Position.UPRIGHT, 'F9'],
      ]),
    };
    assert.deepStrictEqual(
      board.getSurroundingCells(c.cell, c.corners),
      c.outptut,
    );
  });

  it('should work for J1 without corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'J1' as Cell,
      outptut: new Map([
        [Position.CENTER, 'J1'],
        [Position.LEFT, 'I1'],
        [Position.DOWN, 'J2'],
      ]),
    };
    assert.deepStrictEqual(board.getSurroundingCells(c.cell), c.outptut);
  });

  it('should work for J1 with corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'J1' as Cell,
      corners: true,
      outptut: new Map([
        [Position.CENTER, 'J1'],
        [Position.LEFT, 'I1'],
        [Position.DOWN, 'J2'],
        [Position.DOWNLEFT, 'I2'],
      ]),
    };
    assert.deepStrictEqual(
      board.getSurroundingCells(c.cell, c.corners),
      c.outptut,
    );
  });

  it('should work for J5 without corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'J5' as Cell,
      outptut: new Map([
        [Position.CENTER, 'J5'],
        [Position.LEFT, 'I5'],
        [Position.UP, 'J4'],
        [Position.DOWN, 'J6'],
      ]),
    };
    assert.deepStrictEqual(board.getSurroundingCells(c.cell), c.outptut);
  });

  it('should work for J5 with corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'J5' as Cell,
      corners: true,
      outptut: new Map([
        [Position.CENTER, 'J5'],
        [Position.LEFT, 'I5'],
        [Position.UP, 'J4'],
        [Position.DOWN, 'J6'],
        [Position.UPLEFT, 'I4'],
        [Position.DOWNLEFT, 'I6'],
      ]),
    };
    assert.deepStrictEqual(
      board.getSurroundingCells(c.cell, c.corners),
      c.outptut,
    );
  });

  it('should work for J10 without corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'J10' as Cell,
      outptut: new Map([
        [Position.CENTER, 'J10'],
        [Position.LEFT, 'I10'],
        [Position.UP, 'J9'],
      ]),
    };
    assert.deepStrictEqual(board.getSurroundingCells(c.cell), c.outptut);
  });

  it('should work for J10 with corners', () => {
    board.initializeBoardSize(10, 10);
    const c = {
      cell: 'J10' as Cell,
      corners: true,
      outptut: new Map([
        [Position.CENTER, 'J10'],
        [Position.LEFT, 'I10'],
        [Position.UP, 'J9'],
        [Position.UPLEFT, 'I9'],
      ]),
    };
    assert.deepStrictEqual(
      board.getSurroundingCells(c.cell, c.corners),
      c.outptut,
    );
  });
});

describe('getSurroundingCells for rectangular boards', () => {
  it('should work for J2 without corners', () => {
    board.initializeBoardSize(5, 10);
    const c = {
      cell: 'J2' as Cell,
      outptut: new Map([
        [Position.CENTER, 'J2'],
        [Position.LEFT, 'I2'],
        [Position.UP, 'J1'],
        [Position.DOWN, 'J3'],
      ]),
    };
    assert.deepStrictEqual(board.getSurroundingCells(c.cell), c.outptut);
  });
});
