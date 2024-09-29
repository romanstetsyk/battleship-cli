import prompts, { PromptObject } from 'prompts';
import * as readline from 'node:readline';
import { Battleship } from './core.js';
import { getRowLetter, randomElement } from './helpers.js';
import { Cell, Direction, MoveResult } from './types.js';

const GameCommand = {
  NEW: 'new',
  EXIT: 'exit',
  QUIT: 'quit',
  MANUAL: 'manual',
} as const;
type GameCommand = (typeof GameCommand)[keyof typeof GameCommand];

type Constructor = {
  height: number;
  width: number;
  shipSizes: number[];
};

class Game {
  public height;
  public width;
  public shipSizes;

  public playerBoard;
  public computerBoard;
  public finished;
  public logs: string[];

  public constructor({ height, width, shipSizes }: Constructor) {
    this.height = height;
    this.width = width;
    this.shipSizes = shipSizes;

    this.playerBoard = new Battleship();
    this.computerBoard = new Battleship();
    this.logs = [];
    this.finished = false;
  }

  public generateRandomBoards(): void {
    const maxTries = 10000;
    try {
      for (let i = 0; i <= maxTries; i += 1) {
        try {
          this.playerBoard.randomBoard(
            [this.height, this.width],
            this.shipSizes,
          );
          this.computerBoard.randomBoard(
            [this.height, this.width],
            this.shipSizes,
          );
          break;
        } catch {
          this.playerBoard.reset();
          if (i === maxTries) {
            throw new Error(`Couldn't generate random board ${maxTries} times`);
          }
        }
      }
    } catch {
      console.log(
        `Not enough space to randomly generage a board of size ${this.height}x${this.width} with all ships: ${this.shipSizes.join(' ')}`,
      );
      process.exit(1);
    }
  }

  public fillBoard(board: Battleship, highlightAllShips = false): string[] {
    const rows: string[] = [];
    for (let i = 0; i < board.height; i += 1) {
      const y = i + 1;
      const row = [y.toString().padStart(2, ' ')];
      for (let j = 0; j < board.width; j += 1) {
        const x = getRowLetter(j);
        const coord: Cell = `${x}${y}`;
        if (board.sunkCells.has(coord)) {
          row.push('\x1b[31m#\x1b[0m');
        } else if (board.hits.has(coord)) {
          row.push('\x1b[31mx\x1b[0m');
        } else if (board.isShip(coord) && highlightAllShips) {
          row.push('*');
        } else if (board.misses.has(coord)) {
          row.push('⋅');
        } else {
          row.push(' ');
        }
      }
      rows.push(row.join(' '));
    }
    return rows;
  }

  public drawGrid(
    height: number,
    width: number,
    info?: { heading: string; content: string[] },
  ): string {
    const spacing = ' '.repeat(4);
    const offset = ' '.repeat(3);
    const header = Array.from({ length: width }, (_, i) => {
      return getRowLetter(i);
    }).join(' ');
    const players =
      offset +
      'Computer'.padEnd(width * 2 - 1, ' ') +
      spacing +
      offset +
      'Me'.padEnd(width * 2 - 1, ' ') +
      spacing +
      (info ? info.heading : 'Moves');
    const headerRow = offset + header + spacing + offset + header;

    const rows: string[] = [];

    const cRows = this.fillBoard(this.computerBoard);
    const pRows = this.fillBoard(this.playerBoard, true);
    const infoRows = (info ? info.content : this.logs).slice(-height);
    for (let i = 0; i < height; i += 1) {
      const computerRow = cRows[i];
      const playerRow = pRows[i];
      const infoRow = infoRows[i] ?? '';
      const gameRow = computerRow + spacing + playerRow + spacing + infoRow;
      rows.push(gameRow);
    }

    return '\n' + players + '\n' + headerRow + '\n' + rows.join(' \n') + '\n';
  }

  public computerMove(): void {
    while (true) {
      const cell = randomElement([...this.playerBoard.untouchedCells]);
      const res = this.playerBoard.makeMove(cell);
      switch (res.moveResult) {
        case MoveResult.MISS:
          this.logValidMove('Computer', res.coord, res.moveResult);
          return;
        case MoveResult.HIT:
          this.logValidMove('Computer', res.coord, res.moveResult);
          break;
        case MoveResult.SINK:
          this.logValidMove('Computer', res.coord, res.moveResult);
          if (this.playerBoard.gameLost) {
            return;
          }
          break;
      }
    }
  }

  public logMessage(message: string): void {
    const msg = `\x1b[2m${message}\x1b[0m`;
    this.logs.push(msg);
  }

  public logValidMove(player: string, coord: Cell, moveResult: MoveResult) {
    const message = `\x1b[2m${player}: ${coord} - ${moveResult}\x1b[0m`;
    this.logs.push(message);
  }

  public logInvalidMove(answer: string) {
    const message = `\x1b[2mInvalid move \`${answer}\`. Try again.\x1b[0m`;
    this.logs.push(message);
  }

  public playerMove(answer: string): void {
    const answerUpper = answer.toUpperCase();
    const res = this.computerBoard.makeMove(answerUpper as Cell);
    switch (res.moveResult) {
      case MoveResult.MISS:
        this.logValidMove('You', res.coord, res.moveResult);
        this.computerMove();
        if (this.playerBoard.gameLost) {
          this.logMessage('Computer won!');
          this.finished = true;
        }
        break;
      case MoveResult.HIT:
        this.logValidMove('You', res.coord, res.moveResult);
        break;
      case MoveResult.SINK:
        this.logValidMove('You', res.coord, res.moveResult);
        if (this.computerBoard.gameLost) {
          this.logMessage('You won!');
          this.finished = true;
        }
        break;
    }
  }

  public isValidMove(answer: string): boolean {
    return this.computerBoard.allCells.includes(answer.toUpperCase() as Cell);
  }

  public async askShipPositionSingleCell(name: string) {
    const { startingCell }: { startingCell: Cell | undefined } = await prompts({
      type: 'text',
      name: 'startingCell',
      message: `${name}'s position:`,
      format: (value) => value.toUpperCase(),
      validate: (value: string) => {
        const valueUpper = value.toUpperCase();
        if (!/^[A-Z][0-9]{1,2}/.test(valueUpper)) {
          return `Invalid cell \`${value}\`. Try again. Examples: a1, A1`;
        }
        const possibleStartingCells =
          this.playerBoard.possibleShipStartingCells(1, Direction.HORIZONTAL);
        if (
          possibleStartingCells &&
          possibleStartingCells.includes(valueUpper as Cell)
        ) {
          return true;
        }
        return `${name} can't be placed at ${value.toUpperCase()}`;
      },
    });

    return startingCell;
  }

  public async askShipPosition(shipSize: number, name: string) {
    if (shipSize <= 1) {
      throw new Error('ship size must be greater than 1');
    }

    let { direction }: { direction: Direction | undefined } = await prompts({
      type: 'toggle',
      name: 'direction',
      message: `${name}'s direction:`,
      active: Direction.VERTICAL,
      inactive: Direction.HORIZONTAL,
      format: (value) => (value ? Direction.VERTICAL : Direction.HORIZONTAL),
    });

    // Canceled prompt
    if (direction === undefined) {
      return [undefined, undefined] satisfies [undefined, undefined];
    }

    const { startingCell }: { startingCell: Cell | undefined } = await prompts({
      type: 'text',
      name: 'startingCell',
      message: `${name}'s starting square:`,
      format: (value) => value.toUpperCase(),
      validate: (value: string) => {
        const valueUpper = value.toUpperCase();
        if (!/^[A-Z][0-9]{1,2}/.test(valueUpper)) {
          return `Invalid cell \`${value}\`. Try again. Examples: a1, A1`;
        }
        const possibleStartingCells =
          this.playerBoard.possibleShipStartingCells(shipSize, direction);
        if (
          possibleStartingCells &&
          possibleStartingCells.includes(valueUpper as Cell)
        ) {
          return true;
        }
        return `${direction.slice(0, 1).toUpperCase() + direction.slice(1)} ship can't start at ${value.toUpperCase()}`;
      },
    });

    // Canceled prompt
    if (startingCell === undefined) {
      return [undefined, undefined] satisfies [undefined, undefined];
    }

    return [direction, startingCell] satisfies [
      Direction | undefined,
      Cell | undefined,
    ];
  }

  public resetGame() {
    this.playerBoard.reset();
    this.computerBoard.reset();
    this.logs = [];
  }

  public getShipsOptions({
    shipTypes,
    sizes,
  }: {
    shipTypes: string[];
    sizes: number[];
  }) {
    const maxLength = Math.max(...shipTypes.map((e) => e.length));
    const counts = [...sizes]
      .sort((a, b) => b - a)
      .reduce<Record<string, { size: number; count: number }>>((acc, size) => {
        const shipType = shipTypes[size - 1];
        if (!shipType) {
          throw new Error('Ship size is bigger than array of names');
        }
        const existing = acc[shipType];
        acc[shipType] = existing
          ? { size: existing.size, count: existing.count + 1 }
          : { size, count: 1 };
        return acc;
      }, {});

    const title = Object.entries(counts)
      .map(([shipType, { size, count }]) => {
        return `${count} x ${shipType} (${size})`;
      })
      .join(', ');

    const value = sizes.map((size) => {
      const shipType = shipTypes[size - 1];
      if (!shipType) {
        throw new Error('Ship size is bigger than array of names');
      }
      return {
        size,
        state: `  ${shipType.padEnd(maxLength, ' ')}: ${'* '.repeat(size)}`,
        name: shipType,
      };
    });
    return { title, value: { value, title } };
  }

  public async askFleetType() {
    const resp: {
      fleet:
        | {
            title: string;
            value: { size: number; state: string; name: string }[];
          }
        | undefined;
    } = await prompts<'fleet'>({
      type: 'select',
      name: 'fleet',
      choices: [
        {
          ...this.getShipsOptions({
            shipTypes: [
              'Patrol Boat',
              'Submarine',
              'Destroyer',
              'Corvette',
              'Cruiser',
              'Battleship',
              'Carrier',
              'Frigate',
            ],
            sizes: this.shipSizes,
          }),
        },
        {
          ...this.getShipsOptions({
            shipTypes: ['Submarine', 'Destroyer', 'Cruiser', 'Battleship'],
            sizes: [4, 3, 3, 2, 2, 2, 1, 1, 1, 1],
          }),
        },
        {
          ...this.getShipsOptions({
            shipTypes: ['', 'Destroyer', 'Cruiser', 'Battleship', 'Carrier'],
            sizes: [5, 4, 3, 3, 2],
          }),
        },
        {
          ...this.getShipsOptions({
            shipTypes: ['', 'Destroyer', 'Cruiser', 'Battleship', 'Carrier'],
            sizes: [5, 4, 3, 3, 3, 2, 2],
          }),
        },
      ],
      message: 'Select fleet:',
    });
    return resp.fleet;
  }

  public async manual(): Promise<boolean> {
    this.playerBoard.initializeBoardSize(this.height, this.width);
    this.computerBoard.initializeBoardSize(this.height, this.width);
    console.log(
      this.drawGrid(this.height, this.width, { heading: '', content: [] }),
    );

    const response = await this.askFleetType();
    if (!response) {
      return false;
    }

    const { value: fleet, title } = response;

    const questionLength = 18; // '✔ Select fleet: › '
    const offset = Math.ceil(
      (title.length + questionLength) / process.stdout.columns,
    );
    readline.moveCursor(process.stdout, 0, -this.height - 4 - offset); // num of choices
    readline.clearLine(process.stdout, 0);
    readline.clearScreenDown(process.stdout);

    this.computerBoard.randomBoard(
      [this.height, this.width],
      fleet.map((e) => e.size),
    );

    for (let i = 0; i < fleet.length; i += 1) {
      const shipDetails = fleet[i];
      if (!shipDetails) {
        throw new Error('Cannot extract ship details');
      }
      let { size, name } = shipDetails;
      shipDetails.state = '◯' + shipDetails.state.slice(1);
      console.log(
        this.drawGrid(this.height, this.width, {
          heading: 'My fleet',
          content: fleet.map((e) => e.state),
        }),
      );

      let startingCell: Cell | undefined;
      let direction: Direction | undefined;
      if (size === 1) {
        startingCell = await this.askShipPositionSingleCell(name);
        direction = Direction.HORIZONTAL;
      } else {
        [direction, startingCell] = await this.askShipPosition(size, name);
      }
      // Canceled prompt
      if (!direction || !startingCell) {
        return false;
      }

      const shipCoords = this.playerBoard.generateShipCoords(
        size,
        startingCell,
        direction,
      );
      this.playerBoard.placeShipAndBlockSurroundingCells(shipCoords);

      shipDetails.state = '✔' + shipDetails.state.slice(1);

      const offset = size > 1 ? 6 : 5;
      readline.moveCursor(process.stdout, 0, -this.height - offset);
      readline.clearLine(process.stdout, 0);
      readline.clearScreenDown(process.stdout);
    }

    return true;
  }

  public async play() {
    console.log(this.drawGrid(this.height, this.width));

    const qs: PromptObject = {
      type: 'text',
      name: 'cell',
      message: 'Your move:',
      validate: (value: string) => {
        const lower = value.toLowerCase();
        if (Object.values(GameCommand).includes(lower as GameCommand)) {
          return true;
        }
        if (this.isValidMove(value)) {
          return true;
        }
        return `Invalid move \`${value}\`. Try again. Examples: a1, A1`;
      },
    };

    await prompts(qs, {
      onSubmit: async (_, answer) => {
        readline.moveCursor(process.stdout, 0, -this.height - 5);
        readline.clearLine(process.stdout, 0);
        readline.clearScreenDown(process.stdout);

        const answerLower = answer.toLowerCase();

        switch (answerLower) {
          case GameCommand.MANUAL: {
            this.resetGame();
            const canStart = await this.manual();
            if (!canStart) {
              return;
            }
            break;
          }
          case GameCommand.EXIT:
          case GameCommand.QUIT: {
            this.logMessage('Game interrupted');
            console.log(this.drawGrid(this.height, this.width));
            return;
          }
          case GameCommand.NEW: {
            this.resetGame();
            this.generateRandomBoards();
            break;
          }
          default: {
            this.playerMove(answerLower);
            if (this.finished) {
              console.log(this.drawGrid(this.height, this.width));
              return;
            }
          }
        }

        this.play();
      },
    });
  }
}

export { Game };
