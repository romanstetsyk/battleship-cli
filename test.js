import * as readline from "node:readline";
import { Battleship } from "./main.js";

const width = 10;
const height = 8;

const playerBoard = new Battleship();
const computerBoard = new Battleship();

playerBoard.randomBoard([width, height], [5, 4, 3]);
computerBoard.randomBoard([width, height], [5, 4, 3]);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const endGame = () => new Promise((res, rej) => res(1));

let n = 5;

const myMoves = {};

const grid = function (width, height) {
  const spacing = "    ";
  const header = Array.from({ length: width }, (_, i) => {
    return String.fromCharCode(65 + i);
  }).join(" ");
  const headerRow = " ".repeat(3) + header + spacing + " ".repeat(3) + header;

  let rows = [];
  for (let i = 1; i <= height; i += 1) {
    let computerRow = [i.toString().padStart(2, " ")];
    for (let j = 65; j < 65 + width; j += 1) {
      const coord = `${String.fromCharCode(j)}${i}`;
      if (!myMoves.hasOwnProperty(`${String.fromCharCode(j)}${i}`)) {
        myMoves[`${String.fromCharCode(j)}${i}`] = ".";
      }
      if (computerBoard.hits.has(coord)) {
        computerRow.push("x");
      } else if (computerBoard.misses.has(coord)) {
        computerRow.push(".");
      } else {
        computerRow.push(" ");
      }
    }

    let playerRow = [i.toString().padStart(2, " ")];
    for (let j = 65; j < 65 + width; j += 1) {
      if (!myMoves.hasOwnProperty(`${String.fromCharCode(j)}${i}`)) {
        myMoves[`${String.fromCharCode(j)}${i}`] = ".";
      }
      playerRow.push(myMoves[`${String.fromCharCode(j)}${i}`]);
    }
    const gameRow = computerRow.join(" ") + spacing + computerRow.join(" ");
    rows.push(gameRow);
  }

  rows = rows.join(" \n");

  return headerRow + "\n" + rows;
};

function move() {
  rl.question(grid(width, height) + "\nYour move (e.g. A1) : ", answer => {
    // readline.moveCursor(process.stdout, 0, -26);
    readline.clearLine();
    readline.clearScreenDown();
    console.log(answer);

    myMoves[answer] = "x";

    computerBoard.makeMove("A3");

    if (n === 0) {
      endGame().finally(() => rl.close());
    }
    n--;
    move();
  });
}

move();
