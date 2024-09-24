type Cell = `${string}${number}` | `${string}${number}${number}`;
type Ship = Set<Cell>;

const Direction = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
} as const;
type Direction = typeof Direction[keyof typeof Direction];

const Position = {
  CENTER: "center",
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
  DOWN: "down",
  UPLEFT: "upleft",
  DOWNLEFT: "downleft",
  UPRIGHT: "upright",
  DOWNRIGHT: "downright",
} as const;
type Position = typeof Position[keyof typeof Position];

const MoveResult = {
  HIT: "hit",
  MISS: "miss",
  SINK: "sink",
} as const;
type MoveResult = typeof MoveResult[keyof typeof MoveResult];

export type { Cell, Ship };
export { MoveResult, Position, Direction };
