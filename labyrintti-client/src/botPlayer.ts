import { Direction, GamePieceWithObject, GameSettings, GameState, Vector2 } from "./types";
import { getReachable } from "./pathUtils";

export interface PushAction {
  position: Vector2;
  direction: Direction;
}

const opposites: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function isValidPush(game: GameState, position: Vector2, direction: Direction): boolean {
  const { board, lastPush } = game;
  const isColumnPush = direction === "up" || direction === "down";

  const anchor = isColumnPush ? board[0]?.[position.x] : board[position.y]?.[0];
  if (anchor?.fixed) return false;

  if (lastPush && direction === opposites[lastPush.direction]) {
    const sameIndex = isColumnPush
      ? position.x === lastPush.position.x
      : position.y === lastPush.position.y;
    if (sameIndex) return false;
  }

  return true;
}

export function getValidPushMoves(game: GameState, settings: GameSettings): PushAction[] {
  const { rows, columns } = settings;
  const moves: PushAction[] = [];

  for (let x = 0; x < columns; x++) {
    if (isValidPush(game, { x, y: 0 }, "down"))
      moves.push({ position: { x, y: 0 }, direction: "down" });
    if (isValidPush(game, { x, y: rows - 1 }, "up"))
      moves.push({ position: { x, y: rows - 1 }, direction: "up" });
  }
  for (let y = 1; y < rows - 1; y++) {
    if (isValidPush(game, { x: 0, y }, "right"))
      moves.push({ position: { x: 0, y }, direction: "right" });
    if (isValidPush(game, { x: columns - 1, y }, "left"))
      moves.push({ position: { x: columns - 1, y }, direction: "left" });
  }

  return moves;
}

export function pickBotPush(game: GameState, settings: GameSettings): PushAction | null {
  const moves = getValidPushMoves(game, settings);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

export function pickBotMove(board: GamePieceWithObject[][], playerPos: Vector2): Vector2 {
  const reachable = getReachable(board, playerPos);
  const candidates: Vector2[] = [];
  for (let y = 0; y < reachable.length; y++) {
    for (let x = 0; x < (reachable[y]?.length ?? 0); x++) {
      if (reachable[y][x]) candidates.push({ x, y });
    }
  }
  if (candidates.length === 0) return playerPos;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
