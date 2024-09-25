import {
  allEqual,
  getRowLetter,
  xDifferByOne,
  yDifferByOne,
  randomElement,
} from './helpers.js';
import type { Ship, Cell } from './types.js';
import { MoveResult, Position, Direction } from './types.js';

export class Battleship {
  public height = 0;
  public width = 0;
  public allCells: Cell[] = [];
  public blockedCells = new Set<Cell>();
  public untouchedCells = new Set<Cell>();
  public allShips: Ship[] = [];
  public remainingShips: Ship[] = [];
  public sunkCells = new Set<Cell>();
  public hits = new Set<Cell>();
  public misses = new Set<Cell>();
  public gameLost = false;

  constructor() {
    // All cells. for a 10x10 board there are 100 cells
    this.allCells = [];
    // All cells with ships in them and cells that surrond the ships
    this.blockedCells = new Set();
    // Array of all ships, e.g [ ['0-0','0-1','0,2'], ['5-5','5-6'] ]
    this.allShips = [];
    // Ships that were not hit. It equals to all ships at the start of the game
    this.remainingShips = [];
    // Array of cells that your opponent missed.
    this.misses = new Set();
    // Array of cells that your opponent hit.
    this.hits = new Set();
    // Availale cells to make moves. Those that are not misses or hits.
    this.untouchedCells = new Set();
    // if gameLost is true can't make moves
    this.gameLost = false;
  }
  /**
   * Sets the list of all cells and available cells. The size of the array is h*w
   * This is a helper method for this.randomBoard method
   */
  initializeBoardSize(h: number, w: number) {
    if (!Number.isInteger(h) || !Number.isInteger(w)) {
      throw new Error('Height and width must be integers');
    }
    if (h < 5 || h > 26 || w < 5 || w > 26) {
      throw new Error('Height and width must be between 5 and 26 inclusive');
    }

    this.height = h;
    this.width = w;

    for (let i = 0; i < this.height; i += 1) {
      for (let j = 0; j < this.width; j += 1) {
        const x = getRowLetter(i);
        const y = j + 1;
        const cell: Cell = `${x}${y}`;
        this.allCells.push(cell);
        this.untouchedCells.add(cell);
      }
    }
  }

  reset() {
    this.height = 0;
    this.width = 0;
    this.allCells = [];
    this.blockedCells = new Set();
    this.allShips = [];
    this.remainingShips = [];
    this.misses = new Set();
    this.hits = new Set();
    this.untouchedCells = new Set();
    this.gameLost = false;
    this.sunkCells = new Set();
  }

  randomBoard([h, w]: [number, number], arrayOfShipSizes: number[]) {
    try {
      this.reset();
      this.initializeBoardSize(h, w);
      arrayOfShipSizes.forEach((size) => {
        const ship = this.generateRandomShipCoords(size);
        this.placeShipAndBlockSurroundingCells(ship);
      });
    } catch (err) {
      console.error(err);
      this.reset();
    }
  }

  possibleShipStartingCells(shipSize: number, direction: Direction): Cell[] {
    const arrayOfCells: Cell[] = [];

    const step = direction === Direction.HORIZONTAL ? this.width : 1;

    outerLoop: for (let i = 0; i < this.allCells.length; i += 1) {
      const currentCell = this.allCells[i];
      if (!currentCell) {
        throw new Error('No cell');
      }
      const potentialShipCells: Cell[] = [];
      for (let j = i; j < i + shipSize * step; j += step) {
        const cell = this.allCells[j];
        if (!cell || this.blockedCells.has(cell)) {
          continue outerLoop;
        }
        potentialShipCells.push(cell);
      }
      const xCoords = potentialShipCells.map((cell) => this.getX(cell));
      const yCoords = potentialShipCells.map((cell) => this.getY(cell));

      switch (direction) {
        case Direction.HORIZONTAL: {
          if (allEqual(yCoords) && xDifferByOne(xCoords)) {
            arrayOfCells.push(currentCell);
          }
          break;
        }
        case Direction.VERTICAL: {
          if (yDifferByOne(yCoords) && allEqual(xCoords)) {
            arrayOfCells.push(currentCell);
          }
          break;
        }
        default: {
          throw new Error('Unknown direction');
        }
      }
    }

    if (arrayOfCells.length === 0) {
      throw new Error(`Not enough space for a ship size ${shipSize}`);
    }

    return arrayOfCells;
  }

  generateRandomShipCoords(shipSize: number): Ship {
    const direction = randomElement(Object.values(Direction));
    const possibleCells = this.possibleShipStartingCells(shipSize, direction);
    const startingCell = randomElement(possibleCells);
    if (!startingCell) {
      throw new Error('Index out of range');
    }
    if (!possibleCells.includes(startingCell)) {
      throw new Error("Can't place this ship here");
    }
    return this.generateShipCoords(shipSize, startingCell, direction);
  }

  generateShipCoords(
    shipSize: number,
    startingCell: Cell,
    direction: Direction,
  ): Ship {
    const startIndex = this.allCells.indexOf(startingCell);
    if (startIndex === -1) {
      throw new Error('startIndex not found');
    }

    const step = direction === Direction.HORIZONTAL ? this.width : 1;

    const shipCoords: Ship = new Set<Cell>();

    for (let i = startIndex; i < startIndex + shipSize * step; i += step) {
      const cell = this.allCells[i];
      if (!cell) {
        throw new Error('No such cell');
      }
      shipCoords.add(cell);
    }

    return shipCoords;
  }

  getX(cell: Cell): string {
    return cell.slice(0, 1);
  }

  getY(cell: Cell): string {
    return cell.slice(1);
  }

  getSurroundingCells(
    cell: Cell,
    includeCornerCells = false,
  ): Map<Position, Cell> {
    const index = this.allCells.indexOf(cell);

    if (index === -1) {
      throw new Error(
        `Element ${cell} is out of range on a ${this.height}x${this.width} board`,
      );
    }

    // e.g. A1 and A2 -> true, A10 and B1 -> false
    const isSameCol = (cell1: Cell, cell2: Cell) => {
      return this.getX(cell1) === this.getX(cell2);
    };

    // e.g. A1 and A2 -> false, B2 and C2 -> true
    const isSameRow = (cell1: Cell, cell2: Cell) => {
      return this.getY(cell1) === this.getY(cell2);
    };

    const surrondingCells: Map<Position, Cell> = new Map();

    const center = this.allCells[index];
    if (!center) {
      throw new Error('cell should exist');
    }
    const up = this.allCells[index - 1];
    const down = this.allCells[index + 1];
    const left = this.allCells[index - this.width];
    const right = this.allCells[index + this.width];

    surrondingCells.set(Position.CENTER, center);
    if (left && isSameRow(left, center)) {
      surrondingCells.set(Position.LEFT, left);
    }
    if (right && isSameRow(right, center)) {
      surrondingCells.set(Position.RIGHT, right);
    }
    if (up && isSameCol(up, center)) {
      surrondingCells.set(Position.UP, up);
    }
    if (down && isSameCol(down, center)) {
      surrondingCells.set(Position.DOWN, down);
    }

    if (includeCornerCells) {
      const upLeft = this.allCells[index - this.width - 1];
      const downLeft = this.allCells[index - this.width + 1];
      const upRight = this.allCells[index + this.width - 1];
      const downRight = this.allCells[index + this.width + 1];

      if (
        upLeft &&
        left &&
        isSameRow(left, center) &&
        up &&
        isSameCol(up, center)
      ) {
        surrondingCells.set(Position.UPLEFT, upLeft);
      }
      if (
        upRight &&
        right &&
        isSameRow(right, center) &&
        up &&
        isSameCol(up, center)
      ) {
        surrondingCells.set(Position.UPRIGHT, upRight);
      }
      if (
        downLeft &&
        left &&
        isSameRow(left, center) &&
        down &&
        isSameCol(down, center)
      ) {
        surrondingCells.set(Position.DOWNLEFT, downLeft);
      }
      if (
        downRight &&
        right &&
        isSameRow(right, center) &&
        down &&
        isSameCol(down, center)
      ) {
        surrondingCells.set(Position.DOWNRIGHT, downRight);
      }
    }

    return surrondingCells;
  }

  placeShipAndBlockSurroundingCells(
    ship: Ship,
    includeCornerCells = false,
  ): void {
    this.allShips.push(new Set(ship));
    this.remainingShips.push(new Set(ship));
    for (const cell of ship) {
      const surroundingCells = this.getSurroundingCells(
        cell,
        includeCornerCells,
      );
      surroundingCells.forEach((e) => {
        this.blockedCells.add(e);
      });
    }
  }

  makeMove(coord: Cell): {
    coord: Cell;
    moveResult: MoveResult;
    remCellsNum: number;
    gameLost: boolean;
    sunkShip: Ship | undefined;
  } {
    let moveResult: MoveResult = MoveResult.MISS;
    let sunkShip: Ship | undefined;

    outerLoop: for (const ship of this.remainingShips) {
      for (const shipCell of ship) {
        if (shipCell === coord) {
          this.hits.add(coord);
          ship.delete(shipCell);
          moveResult = ship.size === 0 ? MoveResult.SINK : MoveResult.HIT;
          if (moveResult === MoveResult.SINK) {
            sunkShip = this.allShips.find((e) => e.has(coord));
            if (!sunkShip) {
              throw new Error('Sunk ship not found');
            }
            sunkShip.forEach((cell) => {
              this.sunkCells.add(cell);
            });
          }
          break outerLoop;
        }
      }
    }

    if (moveResult === MoveResult.MISS) {
      this.misses.add(coord);
    }

    this.untouchedCells.delete(coord);

    // Number of remaining cells needed to hit to lose the game.
    const remCellsNum = this.remainingShips.reduce((a, e) => a + e.size, 0);
    this.gameLost = remCellsNum === 0;

    return {
      coord,
      moveResult,
      remCellsNum,
      gameLost: this.gameLost,
      sunkShip,
    };
  }
}
