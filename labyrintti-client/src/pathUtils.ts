import { Direction, GamePiece, GamePieceWithObject, Vector2 } from "./types";

const openings: Record<GamePiece["type"], Record<Direction, Direction[]>> = {
  I: {
    up: ["up", "down"],
    down: ["up", "down"],
    left: ["left", "right"],
    right: ["left", "right"],
  },
  L: {
    up: ["up", "left"],
    right: ["right", "up"],
    down: ["down", "right"],
    left: ["left", "down"],
  },
  T: {
    up: ["up", "down", "right"],
    right: ["right", "left", "down"],
    down: ["down", "up", "left"],
    left: ["left", "right", "up"],
  },
};

const opposite: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const neighbors: { direction: Direction; dx: number; dy: number }[] = [
  { direction: "up", dx: 0, dy: -1 },
  { direction: "down", dx: 0, dy: 1 },
  { direction: "left", dx: -1, dy: 0 },
  { direction: "right", dx: 1, dy: 0 },
];

export const getOpenings = (piece: GamePiece): Direction[] => {
  return openings[piece.type][piece.orientation];
};

export const canConnect = (from: GamePiece, to: GamePiece, direction: Direction): boolean => {
  if (!getOpenings(from).includes(direction)) return false;
  if (!getOpenings(to).includes(opposite[direction])) return false;
  return true;
};

export const getReachable = (board: GamePieceWithObject[][], start: Vector2): boolean[][] => {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const reachable: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue: Vector2[] = [start];
  reachable[start.y][start.x] = true;

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentPiece = board[current.y][current.x];

    for (const { direction, dx, dy } of neighbors) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
      if (reachable[ny][nx]) continue;
      if (canConnect(currentPiece, board[ny][nx], direction)) {
        reachable[ny][nx] = true;
        queue.push({ x: nx, y: ny });
      }
    }
  }

  return reachable;
};
