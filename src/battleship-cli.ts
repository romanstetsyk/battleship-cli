import { Option, program } from 'commander';
import process from 'node:process';
import { parseDimension, parsePosIntArrayClosure } from './helpers.js';
import { Game } from './game.js';

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

const game = new Game({ height, width, shipSizes });
game.play();
