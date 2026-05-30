import { Component, createMemo, For, onMount, Show } from "solid-js";
import ObjectWrapper from "./ObjectWrapper";
import { useGameState } from "../contexts/GameStateContext";
import { GamePiece, Vector2 } from "../types";
import Piece from "./Piece";
import { getReachable } from "../util/pathUtils";
import Player from "./Player";
import HighlightPiece from "./HighlightPiece";

interface Props {
  rows: number;
  columns: number;
}

const Board: Component<Props> = (props) => {
  const [gameState, { initializeGame, playPiece, movePlayer }] = useGameState();

  onMount(() => {
    initializeGame();
  });

  const reachable = createMemo(() => {
    if (gameState.game.phase !== "move" || gameState.game.board.length === 0) return null;
    const active = gameState.game.players[gameState.game.activePlayer];
    if (!active) return null;
    return getReachable(gameState.game.board, active.position);
  });

  const undoTilePos = createMemo((): Vector2 | null => {
    if (!gameState.game.lastPush) return null;
    const { direction, position } = gameState.game.lastPush;
    const rows = gameState.settings.rows;
    const cols = gameState.settings.columns;
    switch (direction) {
      case "up":
        return { x: position.x, y: 0 };
      case "down":
        return { x: position.x, y: rows - 1 };
      case "left":
        return { x: 0, y: position.y };
      case "right":
        return { x: cols - 1, y: position.y };
    }
  });

  const pushHighlights = createMemo((): ("valid" | "undo" | null)[][] | null => {
    if (gameState.game.phase !== "push" || gameState.game.board.length === 0) return null;

    const lastRow = gameState.settings.rows - 1;
    const lastCol = gameState.settings.columns - 1;
    const undo = undoTilePos();

    const highlightForTile = (x: number, y: number): "valid" | "undo" | null => {
      if (gameState.game.board[y][x]?.fixed) return null;
      if (y !== 0 && y !== lastRow && x !== 0 && x !== lastCol) return null;
      if (undo?.x === x && undo?.y === y) return "undo";
      return "valid";
    };

    return gameState.game.board.map((row, y) => row.map((_, x) => highlightForTile(x, y)));
  });

  const pieceOnClick = (
    rowIndex: number,
    columnIndex: number,
  ): ((piece: GamePiece) => void) | undefined => {
    const position = { x: columnIndex, y: rowIndex };

    if (gameState.game.phase === "move") {
      return reachable()?.[rowIndex]?.[columnIndex] ? () => movePlayer(position) : undefined;
    }

    if (gameState.game.board[rowIndex]?.[columnIndex]?.fixed) return undefined;

    if (rowIndex === 0) {
      return () => playPiece(position, "down");
    } else if (rowIndex === gameState.settings.rows - 1) {
      return () => playPiece(position, "up");
    } else if (columnIndex === 0) {
      return () => playPiece(position, "right");
    } else if (columnIndex === gameState.settings.columns - 1) {
      return () => playPiece(position, "left");
    }

    return undefined;
  };

  return (
    <div
      class="w-full aspect-square grid gap-1"
      style={{
        "grid-template-columns": `repeat(${props.columns}, 1fr)`,
        "grid-template-rows": `repeat(${props.rows}, 1fr)`,
      }}
    >
      <For each={gameState.game.board}>
        {(row, rowIndex) => (
          <For each={row}>
            {(piece, columnIndex) => (
              <div class="relative w-full h-full">
                <ObjectWrapper
                  object={piece.object}
                  playerColor={piece.playerColor}
                >
                  <Piece piece={piece} onClick={pieceOnClick(rowIndex(), columnIndex())} />
                </ObjectWrapper>
                <Show when={reachable()?.[rowIndex()]?.[columnIndex()]}>
                  <HighlightPiece variant="reachable" />
                </Show>
                <Show when={pushHighlights()?.[rowIndex()]?.[columnIndex()] === "valid"}>
                  <HighlightPiece variant="valid" />
                </Show>
                <Show when={pushHighlights()?.[rowIndex()]?.[columnIndex()] === "undo"}>
                  <HighlightPiece variant="undo" />
                </Show>
                <For
                  each={gameState.game.players.filter(
                    (p) => p.position.x === columnIndex() && p.position.y === rowIndex(),
                  )}
                >
                  {(player) => <Player color={player.color} />}
                </For>
              </div>
            )}
          </For>
        )}
      </For>
    </div>
  );
};

export default Board;
