import { Component, createContext, JSX, useContext } from "solid-js";
import { Direction, GamePieceWithObject, GameSettings, GameState, Vector2 } from "../types";
import { createStore, produce } from "solid-js/store";
import { playerColors } from "../util/pieces";
import { ALL_ITEMS, ITEMS_PER_PLAYER } from "../util/items";
import { shuffle } from "../util/array";

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
    game: {
      board: [],
      extraPiece: null!,
      players: [],
      phase: "push",
      activePlayer: 0,
      lastPush: null,
      winner: null,
    },
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

const buildPushLine = (
  position: Vector2,
  direction: Direction,
  rows: number,
  cols: number,
): Vector2[] => {
  const line: Vector2[] = [];
  if (direction === "up" || direction === "down") {
    for (let i = 0; i < rows; i++) {
      const y = direction === "down" ? i : rows - 1 - i;
      line.push({ x: position.x, y });
    }
  } else {
    for (let i = 0; i < cols; i++) {
      const x = direction === "right" ? i : cols - 1 - i;
      line.push({ x, y: position.y });
    }
  }
  return line;
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
      winner: null,
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
            object: "home",
            playerColor: playerColors[colorIndex],
            fixed: true,
          });
          colorIndex = colorIndex + 1;
        } else if (store.settings.fixedTiles && shouldBeFixed(x, y)) {
          newBoard[y].push({
            type: randomPieceType(),
            orientation: randomOrientation(),
            fixed: true,
          });
        } else {
          newBoard[y].push({ type: randomPieceType(), orientation: randomOrientation() });
        }
      }
    }

    const corners = [
      { x: 0, y: 0 },
      { x: store.settings.columns - 1, y: 0 },
      { x: 0, y: store.settings.rows - 1 },
      { x: store.settings.columns - 1, y: store.settings.rows - 1 },
    ];

    // Assign items to players first — board placement is derived from these assignments.
    const shuffledItems = shuffle(ALL_ITEMS);
    const playerTargets = playerColors.map((_, id) =>
      shuffledItems.slice(id * ITEMS_PER_PLAYER, (id + 1) * ITEMS_PER_PLAYER),
    );

    // Place only the assigned items on random tiles.
    const movablePositions: Vector2[] = [];
    for (let y = 0; y < store.settings.rows; y++) {
      for (let x = 0; x < store.settings.columns; x++) {
        movablePositions.push({ x, y });
      }
    }
    const shuffledPositions = shuffle(movablePositions);
    playerTargets.flat().forEach((item, i) => {
      newBoard[shuffledPositions[i].y][shuffledPositions[i].x].object = item;
    });

    setStore("game", "board", newBoard);
    setStore("game", "phase", "push");
    setStore("game", "activePlayer", 0);
    setStore("game", "lastPush", null);
    setStore("game", "winner", null);

    setStore(
      "game",
      "players",
      playerColors.map((color, id) => ({
        id,
        color,
        position: corners[id],
        homePosition: corners[id],
        isBot: true,
        targetItems: playerTargets[id],
        collectedItems: [],
      })),
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
      const opposites: Record<Direction, Direction> = {
        up: "down",
        down: "up",
        left: "right",
        right: "left",
      };
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

    // Every push is the same operation regardless of direction: walk the line
    // of tiles from the entry edge to the exit edge, sliding the extra piece in
    // at the front and pushing the far tile out the back.
    const line = buildPushLine(position, direction, rows, cols);
    const entered = line[0];
    const ejected = line[line.length - 1];

    setStore(
      "game",
      produce((game) => {
        let carried = game.extraPiece;
        for (const { x, y } of line) {
          const displaced = game.board[y][x];
          game.board[y][x] = carried;
          carried = displaced;
        }
        // The tile shoved off the exit edge becomes the new extra piece, taking
        // any treasure sitting on it into the player's hand.
        game.extraPiece = carried;
      }),
    );

    // A player standing on the ejected tile rides it around to the entry edge.
    setStore("game", "players", (players) =>
      players.map((p) =>
        p.position.x === ejected.x && p.position.y === ejected.y ? { ...p, position: entered } : p,
      ),
    );

    setStore("game", "lastPush", { position, direction });
    setStore("game", "phase", "move");

    return true;
  };

  const movePlayer = (position: Vector2) => {
    setStore(
      "game",
      produce((game) => {
        const player = game.players[game.activePlayer];
        player.position = position;

        // Landing on one of your own target treasures collects it.
        const tile = game.board[position.y][position.x];
        if (tile.object !== undefined && player.targetItems.includes(tile.object)) {
          player.collectedItems.push(tile.object);
          tile.object = undefined;
        }

        // You win by collecting every target and returning to your home corner.
        const allCollected = player.collectedItems.length === ITEMS_PER_PLAYER;
        const atHome = position.x === player.homePosition.x && position.y === player.homePosition.y;
        if (allCollected && atHome) {
          game.winner = player.id;
          return;
        }

        // Otherwise hand the turn to the next player, who pushes first.
        game.activePlayer = (game.activePlayer + 1) % game.players.length;
        game.phase = "push";
      }),
    );
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
