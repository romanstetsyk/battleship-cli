import * as readline from "node:readline";
import { Battleship } from "./core.js";
import { program } from "commander";
import process from "node:process";
import { Cell, MoveResult } from "./types.js";

program.option("-s, --ships [numbers...]", "Ship sizes");
program.parse(process.argv);

const width = 10;
const height = 10;

let ships: number[] | undefined;
let isValidShipArray = false;
if (Array.isArray(program.opts().ships)) {
  ships = program.opts().ships.map(Number);
  isValidShipArray =
    ships?.every((n) => Number.isInteger(n) && n > 0 && n <= 5) ?? false;
}

const playerBoard = new Battleship();
const computerBoard = new Battleship();

playerBoard.randomBoard(
  [width, height],
  isValidShipArray && ships ? ships : [5, 4, 3, 3, 2, 2, 2]
);
computerBoard.randomBoard(
  [width, height],
  isValidShipArray && ships ? ships : [5, 4, 3, 3, 2, 2, 2]
);

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
    const randNum = Math.floor(
      Math.random() * playerBoard.untouchedCells.length
    );
    const cell = playerBoard.untouchedCells[randNum];
    if (!cell) {
      throw new Error("");
    }
    const res = playerBoard.makeMove(cell);
    switch (res.moveResult) {
      case "miss":
        console.log(
          `\x1b[2mComputer's move: ${res.coord}. Result: ${res.moveResult}\x1b[0m`
        );
        return;
      case "hit":
        console.log(
          `\x1b[2mComputer's move: ${res.coord}. Result: ${res.moveResult}\x1b[0m`
        );
        break;
      case "sink":
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
        case "miss":
          logValidMove(res.coord, res.moveResult);
          computerMove();
          if (playerBoard.gameLost) {
            exitGame("Computer won!");
          }
          break;
        case "hit":
          logValidMove(res.coord, res.moveResult);
          break;
        case "sink":
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
