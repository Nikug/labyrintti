export interface GamePiece {
  type: "L" | "I" | "T";
  orientation: "up" | "down" | "left" | "right";
}

export interface GamePieceWithObject extends GamePiece {
  hasObject?: true;
  playerColor?: string;
}
