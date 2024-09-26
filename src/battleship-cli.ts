import * as readline from 'node:readline';
import { Battleship } from './core.js';
import { Option, program } from 'commander';
import process from 'node:process';
import { Cell, MoveResult } from './types.js';
import {
  getRowLetter,
  parseDimension,
  parsePosIntArrayClosure,
  randomElement,
} from './helpers.js';
import prompts, { PromptObject } from 'prompts';

type CliOptions = {
  random: boolean;
  manual: boolean;
  ships: number[];
  height: number;
  width: number;
};
const defaultShipSizes = [5, 4, 3, 3, 2, 2, 2];

program
  .addOption(
    new Option('-r, --random', 'random placement of the ships').default(true),
  )
  .addOption(
    new Option('-m, --manual', 'manual placement of the ships')
      .default(false)
      .conflicts('random'),
  )
  .addOption(
    new Option('-h, --height <number>', "Board's height")
      .default(10)
      .argParser(parseDimension),
  )
  .addOption(
    new Option('-w, --width <number>', "Board's width")
      .default(10)
      .argParser(parseDimension),
  )
  .addOption(
    new Option('-s, --ships <numbers...>', 'Ship sizes')
      .argParser<number[]>(parsePosIntArrayClosure())
      .default(defaultShipSizes),
  );

program.parse(process.argv);

const { ships: shipSizes, height, width } = program.opts<CliOptions>();
console.log({ ships: shipSizes, height, width });

const GameCommand = {
  NEW: 'new',
  EXIT: 'exit',
  QUIT: 'quit',
  MANUAL: 'manual',
} as const;
type GameCommand = (typeof GameCommand)[keyof typeof GameCommand];

class Game {
  public playerBoard;
  public computerBoard;
  public finished;
  public logs: string[];

  public constructor() {
    this.playerBoard = new Battleship();
    this.computerBoard = new Battleship();
    this.logs = [];
    this.finished = false;

    try {
      this.playerBoard.randomBoard([height, width], shipSizes);
      this.computerBoard.randomBoard([height, width], shipSizes);
    } catch {
      console.log(
        `Not enough space to randomly generage a board of size ${height}x${width} with all ships: ${shipSizes.join(' ')}`,
      );
      process.exit(1);
    }
  }

  public fillBoard(board: Battleship, highlightAllShips = false): string[] {
    const rows: string[] = [];
    for (let i = 0; i < board.height; i += 1) {
      const y = i + 1;
      const row = [y.toString().padStart(2, ' ')];
      for (let j = 0; j < width; j += 1) {
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
    console.log(this.drawGrid(height, width));

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
        readline.moveCursor(process.stdout, 0, -height - 5);
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
            console.log(this.drawGrid(height, width));
            return;
          }
          case GameCommand.NEW: {
            this.logs = [];
            this.playerBoard.randomBoard([height, width], shipSizes);
            this.computerBoard.randomBoard([height, width], shipSizes);
            break;
          }
          default: {
            this.playerMove(answerLower);
            if (this.finished) {
              console.log(this.drawGrid(height, width));
              return;
            }
          }
        }

        this.play();
      },
    });
  }
}

const game = new Game();
game.play();
