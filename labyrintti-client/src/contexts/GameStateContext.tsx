import { Component, createContext, JSX, useContext } from "solid-js";
import { GamePieceWithObject, GameSettings, GameState } from "../types";
import { createStore } from "solid-js/store";
import { playerColors } from "../pieces";

export interface GameStateContextValues {
  game: GameState;
  settings: GameSettings;
}

export interface GameStateContextMethods {
  initializeGame: () => void;
}

export type GameStateContext = [GameStateContextValues, GameStateContextMethods];

export const GameStateContext = createContext<GameStateContext>([
  {
    game: { board: [] },
    settings: { rows: 7, columns: 7 },
  },
  {
    initializeGame: () => {},
  },
]);

export const useGameState = () => {
  return useContext(GameStateContext);
};

interface ProviderProps {
  children: JSX.Element;
}

export const GameStateProvider: Component<ProviderProps> = (props) => {
  const [store, setStore] = createStore<GameStateContextValues>({
    game: { board: [] },
    settings: { rows: 7, columns: 7 },
  });

  const randomOrientation = () => {
    return ["up", "down", "left", "right"][
      Math.floor(Math.random() * 4)
    ] as GamePieceWithObject["orientation"];
  };

  const randomPieceType = () => {
    return ["L", "I", "T"][Math.floor(Math.random() * 3)] as GamePieceWithObject["type"];
  };

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

  const contextValue = (): GameStateContext => {
    return [
      store,
      {
        initializeGame: createBoard,
      },
    ];
  };

  return (
    <GameStateContext.Provider value={contextValue()}>{props.children}</GameStateContext.Provider>
  );
};
