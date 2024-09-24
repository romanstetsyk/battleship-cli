type Cell = `${string}${number}` | `${string}${number}${number}`;
type Ship = Set<Cell>;
type Direction = "horizontal" | "vertical";

const MoveResult = {
  HIT: "hit",
  MISS: "miss",
  SINK: "sink",
} as const;
type MoveResult = typeof MoveResult[keyof typeof MoveResult];

export type { Cell, Ship, Direction };
export { MoveResult };
