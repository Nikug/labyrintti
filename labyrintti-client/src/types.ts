export type Direction = "up" | "down" | "left" | "right";

export interface GamePiece {
  type: "L" | "I" | "T";
  orientation: Direction;
}

export interface GamePieceWithObject extends GamePiece {
  hasObject?: true;
  playerColor?: string;
  fixed?: true;
}

export interface GameState {
  board: GamePieceWithObject[][];
  extraPiece: GamePieceWithObject;
}

export interface GameSettings {
  rows: number;
  columns: number;
  fixedTiles: boolean;
}

export interface Vector2 {
  x: number;
  y: number;
}
