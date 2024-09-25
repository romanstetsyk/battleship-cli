import * as readline from 'node:readline';
import { Battleship } from './core.js';
import { Option, program, InvalidArgumentError } from 'commander';
import process from 'node:process';
import { Cell, MoveResult } from './types.js';
import { getRowLetter, randomElement } from './helpers.js';

type CliOptions = {
  random: boolean;
  manual: boolean;
  ships: number[];
  height: number;
  width: number;
};
const defaultShipSizes = [5, 4, 3, 3, 2, 2, 2];

function myParseInt(value: string): number {
  const parsedValue = Number(value);
  if (!Number.isInteger(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

function myParseIntArrayClosure() {
  // The first time validator is invoked
  // the `previous` arg is equal to default value
  let isFirstValue = true;
  return (value: string, previous: number[]): number[] => {
    const parsedValue = myParseInt(value);
    if (isFirstValue) {
      isFirstValue = false;
      return [parsedValue];
    }
    return [...previous, parsedValue];
  };
}

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
      .argParser(myParseInt),
  )
  .addOption(
    new Option('-w, --width <number>', "Board's width")
      .default(10)
      .argParser(myParseInt),
  )
  .addOption(
    new Option('-s, --ships <numbers...>', 'Ship sizes')
      .argParser<number[]>(myParseIntArrayClosure())
      .default(defaultShipSizes),
  );

program.parse(process.argv);

const {
  ships: shipSizes,
  manual,
  random,
  height,
  width,
} = program.opts<CliOptions>();
console.log({ shipSizes, manual, random, height, width });

const playerBoard = new Battleship();
const computerBoard = new Battleship();

playerBoard.randomBoard([width, height], shipSizes);
computerBoard.randomBoard([width, height], shipSizes);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const grid = function (width: number, height: number) {
  const spacing = '    ';
  const offset = ' '.repeat(3);
  const header = Array.from({ length: width }, (_, i) => {
    return getRowLetter(i);
  }).join(' ');
  const players =
    offset + 'Computer'.padEnd(width * 2 - 1, ' ') + spacing + offset + 'Me';
  const headerRow = offset + header + spacing + offset + header;

  const rows: string[] = [];
  for (let i = 0; i < height; i += 1) {
    const y = i + 1;
    const computerRow = [y.toString().padStart(2, ' ')];
    for (let j = 0; j < width; j += 1) {
      const x = getRowLetter(j);
      const coord: Cell = `${x}${y}`;
      if (computerBoard.sunkCells.has(coord)) {
        computerRow.push('\x1b[31m#\x1b[0m');
      } else if (computerBoard.hits.has(coord)) {
        computerRow.push('\x1b[31mx\x1b[0m');
      } else if (computerBoard.misses.has(coord)) {
        computerRow.push('⋅');
      } else {
        computerRow.push(' ');
      }
    }

    const playerRow = [y.toString().padStart(2, ' ')];
    for (let j = 0; j < width; j += 1) {
      const x = getRowLetter(j);
      const coord: Cell = `${x}${y}`;
      const isShip = (coord: Cell) => {
        for (const ship of playerBoard.allShips) {
          if (ship.has(coord)) return true;
        }
        return false;
      };
      if (playerBoard.sunkCells.has(coord)) {
        playerRow.push('\x1b[31m#\x1b[0m');
      } else if (playerBoard.hits.has(coord)) {
        playerRow.push('\x1b[31mx\x1b[0m');
      } else if (isShip(coord)) {
        playerRow.push('*');
      } else if (playerBoard.misses.has(coord)) {
        playerRow.push('⋅');
      } else {
        playerRow.push(' ');
      }
    }

    const gameRow = computerRow.join(' ') + spacing + playerRow.join(' ');
    rows.push(gameRow);
  }

  return '\n' + players + '\n' + headerRow + '\n' + rows.join(' \n') + '\n';
};

function computerMove(): void {
  while (true) {
    const cell = randomElement([...playerBoard.untouchedCells]);
    const res = playerBoard.makeMove(cell);
    switch (res.moveResult) {
      case MoveResult.MISS:
        logValidMove("Computer's", res.coord, res.moveResult);
        return;
      case MoveResult.HIT:
        logValidMove("Computer's", res.coord, res.moveResult);
        break;
      case MoveResult.SINK:
        logValidMove("Computer's", res.coord, res.moveResult);
        if (playerBoard.gameLost) {
          return;
        }
        break;
    }
  }
}

function exitGame(message: string): void {
  console.log(`\x1b[2m${message}\x1b[0m`);
  console.log(grid(width, height));
  rl.close();
  rl.removeAllListeners();
  process.exit(0);
}

function logValidMove(whoseMove: string, coord: Cell, moveResult: MoveResult) {
  const message = `\x1b[2m${whoseMove} move: ${coord}. Result: ${moveResult}\x1b[0m`;
  console.log(message);
}

function logInvalidMove(answer: string) {
  console.log(`\x1b[2mYour move: ${answer}. Invalid move. Try again\x1b[0m`);
}

function play() {
  rl.question(grid(width, height) + "\nYour move (e.g. A1) : ", (answer) => {
    readline.moveCursor(process.stdout, 0, -height - 5);
    readline.clearLine(process.stdout, 0);
    readline.clearScreenDown(process.stdout);

    const answerUpper = answer.toUpperCase();

    if (answerUpper === "EXIT") {
      exitGame("Game interrupted");
    }

    const isValidMove = computerBoard.allCells.includes(answerUpper as Cell);
    if (!isValidMove) {
      logInvalidMove(answerUpper);
    } else {
      const res = computerBoard.makeMove(answerUpper as Cell);
      switch (res.moveResult) {
        case MoveResult.MISS:
                logValidMove('Your', res.coord, res.moveResult);
          computerMove();
          if (playerBoard.gameLost) {
                  exitGame('Computer won!');
          }
          break;
        case MoveResult.HIT:
                logValidMove('Your', res.coord, res.moveResult);
          break;
        case MoveResult.SINK:
                logValidMove('Your', res.coord, res.moveResult);
          if (computerBoard.gameLost) {
                  exitGame('You won!');
          }
          break;
      }
    }

    play();
  });
}

play();
