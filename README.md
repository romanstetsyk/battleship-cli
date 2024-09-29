# Battleship Game (CLI)

A terminal-based Battleship game written in TypeScript where you play against the computer! Sink the computer's ships before it sinks yours.

![Battleship game demo](./demo.gif)

## Features

- Random or Manual Ship Placement: You can either randomly place ships on the board or manually position them.
- Customizable Board and Ships: Adjust the board's dimensions and ship sizes to your liking.
- CLI: Easy-to-use command-line interface with options for quick game setup.

## Installation

Make sure you have Node.js installed.

1. Clone the repository

2. Install dependencies

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

## Usage

```bash
node dist/battleship-cli.js [options]
```

### Available Options

- `-r, --random`: Random placement of the ships (default: `true`)
- `-m, --manual`: Manual placement of the ships (default: `false`)
- `-h, --height <number>`: Board's height (default: `10`)
- `-w, --width <number>`: Board's width (default: `10`)
- `-s, --ships <numbers...>`: Ship sizes (default: `[5,4,3,3,2,2,2]`)
- `--help`: display help for command

_NOTE_: `--ships` should be specified with spaces, e.g. `--ships 5 4 3 2 1`

### Default Game

If you run the game without any options, a random 10x10 board is generated with default ships placed randomly.

### Example Commands

- Random game:

  ```bash
  node dist/battleship-cli.js
  ```

- Manual Ship Placement:

  ```bash
  node dist/battleship-cli.js --manual
  ```

  After selecting this option, you'll be prompted to choose a direction (horizontal or vertical) and a starting square (e.g., `B5`) for each ship.

- 15x15 board:

  ```bash
  node dist/battleship-cli.js -h 15 -w 15
  ```

- Generate 1 ship of size 6, 2 ships of size 5, and 4 ships of size 2:

  ```bash
  node dist/battleship-cli.js -s 6 5 5 2 2 2 2
  ```

## In-Game Commands

During the game, you can input coordinates for your move (e.g., `B5`, `A1`) or use one of the following commands:

- `new`: Start a new random game with the default settings.
- `manual`: Start a new game with manual ship placement.
- `exit` or `quit`: Quit the game.

## Future Plans

- [x] Set width and height of the board
- [x] Manual placement of the ships
- [ ] Add difficulty levels
