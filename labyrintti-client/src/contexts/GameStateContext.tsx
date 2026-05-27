import { Component, createContext, JSX, useContext } from "solid-js";
import { Direction, GamePieceWithObject, GameSettings, GameState, Vector2 } from "../types";
import { createStore, produce } from "solid-js/store";
import { playerColors } from "../pieces";

// Context setup
export interface GameStateContextValues {
  game: GameState;
  settings: GameSettings;
}

export interface GameStateContextMethods {
  initializeGame: () => void;
  playPiece: (position: Vector2, direction: Direction) => boolean;
  rotateExtraPiece: (newOrientation: Direction) => void;
  movePlayer: (position: Vector2) => void;
}

export type GameStateContext = [GameStateContextValues, GameStateContextMethods];

export const GameStateContext = createContext<GameStateContext>([
  {
    game: { board: [], extraPiece: null!, players: [], phase: "push", activePlayer: 0, lastPush: null },
    settings: { rows: 7, columns: 7, fixedTiles: true },
  },
  {
    initializeGame: () => {},
    playPiece: () => false,
    rotateExtraPiece: () => {},
    movePlayer: () => {},
  },
]);

export const useGameState = () => {
  return useContext(GameStateContext);
};

// Random helpers, move somewhere
const randomOrientation = () => {
  return ["up", "down", "left", "right"][
    Math.floor(Math.random() * 4)
  ] as GamePieceWithObject["orientation"];
};

const randomPieceType = () => {
  return ["L", "I", "T"][Math.floor(Math.random() * 3)] as GamePieceWithObject["type"];
};

// Context provider implementation
interface ProviderProps {
  children: JSX.Element;
}

export const GameStateProvider: Component<ProviderProps> = (props) => {
  const [store, setStore] = createStore<GameStateContextValues>({
    game: {
      board: [],
      extraPiece: {
        type: randomPieceType(),
        orientation: randomOrientation(),
      },
      players: [],
      phase: "push",
      activePlayer: 0,
      lastPush: null,
    },
    settings: { rows: 7, columns: 7, fixedTiles: true },
  });

  const getHomePieceOrientation = (x: number, y: number) => {
    if (y === 0 && x === 0) return "down";
    if (y === 0 && x > 0) return "left";
    if (x === 0 && y > 0) return "right";
    return "up";
  };

  const shouldBeFixed = (x: number, y: number) => x % 2 === 0 && y % 2 === 0;

  const shouldBeHomePiece = (x: number, y: number, maxX: number, maxY: number) => {
    if (y === 0 && x === 0) return true;
    if (y === 0 && x === maxX - 1) return true;
    if (x === 0 && y === maxY - 1) return true;
    if (x === store.settings.columns - 1 && y === store.settings.rows - 1) return true;
    return false;
  };

  const createBoard = () => {
    const newBoard: GamePieceWithObject[][] = [];
    let colorIndex = 0;
    for (let y = 0; y < store.settings.rows; ++y) {
      newBoard.push([]);
      for (let x = 0; x < store.settings.columns; ++x) {
        if (shouldBeHomePiece(x, y, store.settings.columns, store.settings.rows)) {
          newBoard[y].push({
            type: "L",
            orientation: getHomePieceOrientation(x, y),
            hasObject: true,
            playerColor: playerColors[colorIndex],
            fixed: true,
          });
          colorIndex = colorIndex + 1;
        } else if (store.settings.fixedTiles && shouldBeFixed(x, y)) {
          newBoard[y].push({ type: randomPieceType(), orientation: randomOrientation(), fixed: true });
        } else {
          newBoard[y].push({ type: randomPieceType(), orientation: randomOrientation() });
        }
      }
    }

    setStore("game", "board", newBoard);
    setStore("game", "phase", "push");
    setStore("game", "activePlayer", 0);
    setStore("game", "lastPush", null);

    const corners = [
      { x: 0, y: 0 },
      { x: store.settings.columns - 1, y: 0 },
      { x: 0, y: store.settings.rows - 1 },
      { x: store.settings.columns - 1, y: store.settings.rows - 1 },
    ];
    setStore(
      "game",
      "players",
      playerColors.map((color, id) => ({ id, color, position: corners[id] })),
    );
  };

  const playPiece = (position: Vector2, direction: Direction): boolean => {
    if (
      position.x !== 0 &&
      position.x !== store.settings.columns - 1 &&
      position.y !== 0 &&
      position.y !== store.settings.rows - 1
    ) {
      console.log("Illegal move, cannot play at", position);
      return false;
    }

    const isColumnPush = direction === "up" || direction === "down";
    const anchorPiece = isColumnPush
      ? store.game.board[0][position.x]
      : store.game.board[position.y][0];
    if (anchorPiece?.fixed) {
      console.log("Illegal move, cannot push a fixed row/column");
      return false;
    }

    if (store.game.lastPush) {
      const { direction: lastDir, position: lastPos } = store.game.lastPush;
      const opposites: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };
      if (direction === opposites[lastDir]) {
        const sameIndex = isColumnPush ? position.x === lastPos.x : position.y === lastPos.y;
        if (sameIndex) {
          console.log("Illegal move, cannot reverse the previous push");
          return false;
        }
      }
    }

    const rows = store.game.board.length;
    const cols = store.game.board[0]?.length ?? 0;
    const ejectedPos: Record<Direction, Vector2> = {
      up:    { x: position.x, y: 0 },
      down:  { x: position.x, y: rows - 1 },
      left:  { x: 0,          y: position.y },
      right: { x: cols - 1,   y: position.y },
    };
    const enteredPos: Record<Direction, Vector2> = {
      up:    { x: position.x, y: rows - 1 },
      down:  { x: position.x, y: 0 },
      left:  { x: cols - 1,   y: position.y },
      right: { x: 0,          y: position.y },
    };

    switch (direction) {
      case "up":
        setStore(
          "game",
          produce((game) => {
            const rows = game.board.length;
            const extraPiece = game.extraPiece;
            game.extraPiece = game.board[0][position.x];
            for (let y = 0; y < rows - 1; y++) {
              game.board[y][position.x] = game.board[y + 1][position.x];
            }
            game.board[position.y][position.x] = extraPiece;
          }),
        );
        break;
      case "down":
        setStore(
          "game",
          produce((game) => {
            const rows = game.board.length;
            const extraPiece = game.extraPiece;
            game.extraPiece = game.board[rows - 1][position.x];
            for (let y = game.board.length - 1; y > 0; y--) {
              game.board[y][position.x] = game.board[y - 1][position.x];
            }
            game.board[position.y][position.x] = extraPiece;
          }),
        );
        break;
      case "left":
        setStore(
          "game",
          produce((game) => {
            const row = game.board[position.y];
            const extraPiece = game.extraPiece;
            game.extraPiece = row.shift()!;
            row.push(extraPiece);
          }),
        );
        break;
      case "right":
        setStore(
          "game",
          produce((game) => {
            const row = game.board[position.y];
            const extraPiece = game.extraPiece;
            game.extraPiece = row.pop()!;
            row.unshift(extraPiece);
          }),
        );
        break;
    }

    const ejected = ejectedPos[direction];
    const entered = enteredPos[direction];
    setStore("game", "players", (players) =>
      players.map((p) =>
        p.position.x === ejected.x && p.position.y === ejected.y
          ? { ...p, position: entered }
          : p,
      ),
    );

    setStore("game", "lastPush", { position, direction });
    setStore("game", "phase", "move");

    return true;
  };

  const movePlayer = (position: Vector2) => {
    const playerCount = store.game.players.length;
    setStore("game", "players", store.game.activePlayer, "position", position);
    setStore("game", "activePlayer", (i) => (i + 1) % playerCount);
    setStore("game", "phase", "push");
  };

  const contextValue = (): GameStateContext => {
    return [
      store,
      {
        initializeGame: createBoard,
        playPiece,
        rotateExtraPiece: (newOrientation: Direction) =>
          setStore("game", "extraPiece", "orientation", newOrientation),
        movePlayer,
      },
    ];
  };

  return (
    <GameStateContext.Provider value={contextValue()}>{props.children}</GameStateContext.Provider>
  );
};
