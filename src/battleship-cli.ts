import * as readline from "node:readline";
import { Battleship } from "./core.js";
import { program } from "commander";
import process from "node:process";
import { Cell, MoveResult } from "./types.js";
import { randomElement } from "./helpers.js";

program.option("-s, --ships [numbers...]", "Ship sizes");
program.parse(process.argv);

const width = 10;
const height = 10;

let shipSizes: number[] = [5, 4, 3, 3, 2, 2, 2];
let isValidShipArray = false;
const { ships } = program.opts();
if (Array.isArray(ships)) {
  const sizes = ships.map(Number);
  isValidShipArray = sizes.every((n) => Number.isInteger(n) && n > 0 && n <= 5);
  if (isValidShipArray) {
    shipSizes = sizes;
  }
}

const playerBoard = new Battleship();
const computerBoard = new Battleship();

playerBoard.randomBoard([width, height], shipSizes);
computerBoard.randomBoard([width, height], shipSizes);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const grid = function (width: number, height: number) {
  const spacing = "    ";
  const header = Array.from({ length: width }, (_, i) => {
    return String.fromCharCode(65 + i);
  }).join(" ");
  const players =
    " ".repeat(3) +
    "Computer".padEnd(width * 2 - 1, " ") +
    spacing +
    " ".repeat(3) +
    "Me";
  const headerRow = " ".repeat(3) + header + spacing + " ".repeat(3) + header;

  const rows: string[] = [];
  for (let i = 1; i <= height; i += 1) {
    const computerRow = [i.toString().padStart(2, " ")];
    for (let j = 65; j < 65 + width; j += 1) {
      const coord: Cell = `${String.fromCharCode(j)}${i}`;
      if (computerBoard.hits.has(coord)) {
        computerRow.push("\x1b[31mx\x1b[0m");
      } else if (computerBoard.misses.has(coord)) {
        computerRow.push("⋅");
      } else {
        computerRow.push(" ");
      }
    }

    const playerRow = [i.toString().padStart(2, " ")];
    for (let j = 65; j < 65 + width; j += 1) {
      const coord: Cell = `${String.fromCharCode(j)}${i}`;

      const isShip = (coord: Cell) => {
        for (const ship of playerBoard.allShips) {
          if (ship.has(coord)) return true;
        }
        return false;
      };

      if (playerBoard.hits.has(coord)) {
        playerRow.push("\x1b[31mx\x1b[0m");
      } else if (isShip(coord)) {
        playerRow.push("*");
      } else if (playerBoard.misses.has(coord)) {
        playerRow.push("⋅");
      } else {
        playerRow.push(" ");
      }
    }

    const gameRow = computerRow.join(" ") + spacing + playerRow.join(" ");
    rows.push(gameRow);
  }

  return "\n" + players + "\n" + headerRow + "\n" + rows.join(" \n") + "\n";
};

function computerMove() {
  while (true) {
    const cell = randomElement([...playerBoard.untouchedCells]);
    if (!cell) {
      throw new Error("");
    }
    const res = playerBoard.makeMove(cell);
    switch (res.moveResult) {
      case MoveResult.MISS:
        console.log(
          `\x1b[2mComputer's move: ${res.coord}. Result: ${res.moveResult}\x1b[0m`
        );
        return;
      case MoveResult.HIT:
        console.log(
          `\x1b[2mComputer's move: ${res.coord}. Result: ${res.moveResult}\x1b[0m`
        );
        break;
      case MoveResult.SINK:
        console.log(
          `\x1b[2mComputer's move: ${res.coord}. Result: ${res.moveResult}\x1b[0m`
        );
        if (playerBoard.gameLost) return;
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

function logValidMove(coord: Cell, moveResult: MoveResult): void {
  console.log(`\x1b[2mYour move: ${coord}. Result: ${moveResult}\x1b[0m`);
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
          logValidMove(res.coord, res.moveResult);
          computerMove();
          if (playerBoard.gameLost) {
            exitGame("Computer won!");
          }
          break;
        case MoveResult.HIT:
          logValidMove(res.coord, res.moveResult);
          break;
        case MoveResult.SINK:
          logValidMove(res.coord, res.moveResult);
          if (computerBoard.gameLost) {
            exitGame("You won!");
          }

          break;
      }
    }

    play();
  });
}

play();
