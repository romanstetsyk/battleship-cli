type Cell = `${string}${number}` | `${string}${number}${number}`;
type Ship = Set<Cell>;
type Direction = "horizontal" | "vertical";
type MoveResult = "hit" | "miss" | "sink";

export type { Cell, Ship, Direction, MoveResult };
