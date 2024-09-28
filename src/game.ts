import prompts, { PromptObject } from 'prompts';
import * as readline from 'node:readline';
import { Battleship } from './core.js';
import { getRowLetter, randomElement } from './helpers.js';
import { Cell, MoveResult } from './types.js';

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

    this.generateRandomBoards();
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

  public drawGrid(height: number, width: number): string {
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
      'Moves';
    const headerRow = offset + header + spacing + offset + header;

    const rows: string[] = [];

    const cRows = this.fillBoard(this.computerBoard);
    const pRows = this.fillBoard(this.playerBoard, true);
    const lRows = this.logs.slice(-height);
    for (let i = 0; i < height; i += 1) {
      const computerRow = cRows[i];
      const playerRow = pRows[i];
      const logRow = lRows[i] ?? '';
      const gameRow = computerRow + spacing + playerRow + spacing + logRow;
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

  public async play() {
    console.log(this.drawGrid(this.height, this.width));

    const qs: PromptObject = {
      type: 'text',
      name: 'cell',
      message: 'Your move (e.g. A1 | a1): ',
      validate: (value: string) => {
        const lower = value.toLowerCase();
        if (Object.values(GameCommand).includes(lower as GameCommand)) {
          return true;
        }
        if (this.isValidMove(value)) {
          return true;
        }
        return `Invalid move \`${value}\`. Try again.`;
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
            break;
          }
          case GameCommand.EXIT:
          case GameCommand.QUIT: {
            this.logMessage('Game interrupted');
            console.log(this.drawGrid(this.height, this.width));
            return;
          }
          case GameCommand.NEW: {
            this.logs = [];
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
