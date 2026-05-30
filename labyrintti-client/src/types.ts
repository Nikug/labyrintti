export type Direction = "up" | "down" | "left" | "right";

export interface GamePiece {
  type: "L" | "I" | "T";
  orientation: Direction;
}

export interface GamePieceWithObject extends GamePiece {
  object?: string;
  playerColor?: string;
  fixed?: true;
}

export interface Player {
  id: number;
  color: string;
  position: Vector2;
  homePosition: Vector2;
  isBot?: true;
  targetItems: string[];
  collectedItems: string[];
}

export interface GameState {
  board: GamePieceWithObject[][];
  extraPiece: GamePieceWithObject;
  players: Player[];
  phase: "push" | "move";
  activePlayer: number;
  lastPush: { position: Vector2; direction: Direction } | null;
  winner: number | null;
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
