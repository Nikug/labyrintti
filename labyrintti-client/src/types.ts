export type Direction = "up" | "down" | "left" | "right";

export interface GamePiece {
  type: "L" | "I" | "T";
  orientation: Direction;
}

export interface GamePieceWithObject extends GamePiece {
  hasObject?: true;
  playerColor?: string;
}

export interface GameState {
  board: GamePieceWithObject[][];
  extraPiece: GamePieceWithObject;
}

export interface GameSettings {
  rows: number;
  columns: number;
}

export interface Vector2 {
  x: number;
  y: number;
}
