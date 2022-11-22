const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const endGame = () => new Promise((res, rej) => res(1));

let n = 5;

const myMoves = {};
const width = 10;
const height = 10;

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
      if (!myMoves.hasOwnProperty(`${String.fromCharCode(j)}${i}`)) {
        myMoves[`${String.fromCharCode(j)}${i}`] = ".";
      }
      computerRow.push(obj[`${String.fromCharCode(j)}${i}`]);
    }

    let playerRow = [i.toString().padStart(2, " ")];
    for (let j = 65; j < 65 + width; j += 1) {
      if (!myMoves.hasOwnProperty(`${String.fromCharCode(j)}${i}`)) {
        myMoves[`${String.fromCharCode(j)}${i}`] = ".";
      }
      computerRow.push(obj[`${String.fromCharCode(j)}${i}`]);
    }
    const gameRow = computerRow.join(" ") + spacing + row.join(" ");
    rows.push(row);
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

    obj[answer] = "x";

    if (n === 0) {
      endGame().finally(() => rl.close());
    }
    n--;
    move();
  });
}

move();
