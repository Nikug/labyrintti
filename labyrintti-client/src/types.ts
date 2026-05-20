export interface GamePiece {
  type: "L" | "I" | "T";
  orientation: "up" | "down" | "left" | "right";
}

export interface GamePieceWithObject extends GamePiece {
  hasObject?: true;
  playerColor?: string;
}

export interface GameState {
  board: GamePieceWithObject[][];
}

export interface GameSettings {
  rows: number;
  columns: number;
}
