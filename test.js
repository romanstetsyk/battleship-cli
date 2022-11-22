import * as readline from "node:readline";
import { Battleship } from "./main.js";

const width = 5;
const height = 5;

const playerBoard = new Battleship();
const computerBoard = new Battleship();

playerBoard.randomBoard([width, height], [5]);
computerBoard.randomBoard([width, height], [5]);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
      const coord = `${String.fromCharCode(j)}${i}`;
      let isShip = false;
      playerBoard.allShips.forEach(ship => {
        if (ship.has(coord)) isShip = true;
      });
      playerRow.push(isShip ? "*" : " ");
    }

    const gameRow = computerRow.join(" ") + spacing + playerRow.join(" ");
    rows.push(gameRow);
  }

  rows = rows.join(" \n");

  return headerRow + "\n" + rows;
};

function computerMove() {
  let randNum = Math.floor(Math.random() * playerBoard.untouchedCells.length);

  while (true) {
    let res = playerBoard.makeMove(playerBoard.untouchedCells[randNum]);
    switch (res.moveResult) {
      case "miss":
        console.log(`Comp move: ${res.coord}. Result: ${res.moveResult}`);
        return;
      case "hit":
        console.log(`Comp move: ${res.coord}. Result: ${res.moveResult}`);
        break;
      case "sink":
        console.log(`Comp move: ${res.coord}. Result: ${res.moveResult}`);
        if (playerBoard.gameLost) return;
        break;
    }
  }
}

function play() {
  rl.question(grid(width, height) + "\nYour move (e.g. A1) : ", answer => {
    readline.moveCursor(process.stdout, 0, -height - 2);
    readline.clearLine(process.stdout, 0);
    readline.clearScreenDown(process.stdout);

    if (answer === "exit") {
      return rl.close();
    }

    if (!computerBoard.allCells.includes(answer.toUpperCase())) {
      console.log(`Your move: ${answer}. No such square. Try again`);
    } else {
      const res = computerBoard.makeMove(answer.toUpperCase());
      switch (res.moveResult) {
        case "miss":
          console.log(`Your move: ${res.coord}. Result: ${res.moveResult}`);
          computerMove();
          if (playerBoard.gameLost) {
            console.log("Comp won");
            return rl.close();
          }
          break;
        case "hit":
          console.log(`Your move: ${res.coord}. Result: ${res.moveResult}`);
          break;
        case "sink":
          console.log(`Your move: ${res.coord}. Result: ${res.moveResult}`);
          if (computerBoard.gameLost) {
            console.log("You won");
            return rl.close();
          }

          break;
      }
    }

    play();
  });
}

play();

rl.on("close", () => {
  console.log(grid(width, height));
});
