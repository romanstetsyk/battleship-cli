import * as readline from "node:readline";
import { Battleship } from "./main.js";
import { program } from "commander";

program.option("-s, --ships [numbers...]", "Ship sizes");
program.parse(process.argv);

const width = 10;
const height = 10;

let ships, isValidShipArray;
if (Array.isArray(program.opts().ships)) {
  ships = program.opts().ships.map(Number);
  isValidShipArray = ships.every(n => Number.isInteger(n) && n > 0 && n <= 5);
}

const playerBoard = new Battleship();
const computerBoard = new Battleship();

playerBoard.randomBoard(
  [width, height],
  isValidShipArray ? ships : [5, 4, 3, 3, 2, 2, 2]
);
computerBoard.randomBoard(
  [width, height],
  isValidShipArray ? ships : [5, 4, 3, 3, 2, 2, 2]
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const grid = function (width, height) {
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

  let rows = [];
  for (let i = 1; i <= height; i += 1) {
    let computerRow = [i.toString().padStart(2, " ")];
    for (let j = 65; j < 65 + width; j += 1) {
      const coord = `${String.fromCharCode(j)}${i}`;
      if (computerBoard.hits.has(coord)) {
        computerRow.push("\x1b[31mx\x1b[0m");
      } else if (computerBoard.misses.has(coord)) {
        computerRow.push("⋅");
      } else {
        computerRow.push(" ");
      }
    }

    let playerRow = [i.toString().padStart(2, " ")];
    for (let j = 65; j < 65 + width; j += 1) {
      const coord = `${String.fromCharCode(j)}${i}`;

      const isShip = coord => {
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

  rows = rows.join(" \n");

  return "\n" + players + "\n" + headerRow + "\n" + rows + "\n";
};

function computerMove() {
  let randNum = Math.floor(Math.random() * playerBoard.untouchedCells.length);

  while (true) {
    let res = playerBoard.makeMove(playerBoard.untouchedCells[randNum]);
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

let start = false;
function play() {
  start = true;
  rl.question(grid(width, height) + "\nYour move (e.g. A1) : ", answer => {
    readline.moveCursor(process.stdout, 0, -height - 5);
    readline.clearLine(process.stdout, 0);
    readline.clearScreenDown(process.stdout);

    if (answer === "exit") {
      console.log("Canceled");
      console.log(grid(width, height));
      return rl.close();
    }

    if (!computerBoard.allCells.includes(answer.toUpperCase())) {
      console.log(`Your move: ${answer}. No such square. Try again`);
    } else {
      const res = computerBoard.makeMove(answer.toUpperCase());
      switch (res.moveResult) {
        case "miss":
          console.log(
            `\x1b[2mYour move: ${res.coord}. Result: ${res.moveResult}\x1b[0m`
          );
          computerMove();
          if (playerBoard.gameLost) {
            console.log("Comp won");
            console.log(grid(width, height));
            return rl.close();
          }
          break;
        case "hit":
          console.log(
            `\x1b[2mYour move: ${res.coord}. Result: ${res.moveResult}\x1b[0m`
          );
          break;
        case "sink":
          console.log(
            `\x1b[2mYour move: ${res.coord}. Result: ${res.moveResult}\x1b[0m`
          );
          if (computerBoard.gameLost) {
            console.log("You won");
            console.log(grid(width, height));
            return rl.close();
          }

          break;
      }
    }

    play();
  });
}

play();
