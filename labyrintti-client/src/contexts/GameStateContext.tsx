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
}

export type GameStateContext = [GameStateContextValues, GameStateContextMethods];

export const GameStateContext = createContext<GameStateContext>([
  {
    game: { board: [], extraPiece: null! },
    settings: { rows: 7, columns: 7 },
  },
  {
    initializeGame: () => {},
    playPiece: () => false,
    rotateExtraPiece: () => {},
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
    },
    settings: { rows: 7, columns: 7 },
  });

  const getHomePieceOrientation = (x: number, y: number) => {
    if (y === 0 && x === 0) return "down";
    if (y === 0 && x > 0) return "left";
    if (x === 0 && y > 0) return "right";
    return "up";
  };

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
          });
          colorIndex = colorIndex + 1;
        } else {
          newBoard[y].push({ type: randomPieceType(), orientation: randomOrientation() });
        }
      }
    }

    setStore("game", "board", newBoard);
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

    return true;
  };

  const contextValue = (): GameStateContext => {
    return [
      store,
      {
        initializeGame: createBoard,
        playPiece,
        rotateExtraPiece: (newOrientation: Direction) =>
          setStore("game", "extraPiece", "orientation", newOrientation),
      },
    ];
  };

  return (
    <GameStateContext.Provider value={contextValue()}>{props.children}</GameStateContext.Provider>
  );
};
