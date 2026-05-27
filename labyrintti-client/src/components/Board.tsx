import { Component, For, onMount, Show } from "solid-js";
import ObjectWrapper from "./ObjectWrapper";
import { useGameState } from "../contexts/GameStateContext";
import { GamePiece } from "../types";
import Piece from "./Piece";

interface Props {
  rows: number;
  columns: number;
}

const Board: Component<Props> = (props) => {
  const [gameState, { initializeGame, playPiece }] = useGameState();

  onMount(() => {
    initializeGame();
  });

  const pieceOnClick = (
    rowIndex: number,
    columnIndex: number,
  ): ((piece: GamePiece) => void) | undefined => {
    const position = { x: columnIndex, y: rowIndex };

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
              <Show
                when={piece.hasObject}
                fallback={<Piece piece={piece} onClick={pieceOnClick(rowIndex(), columnIndex())} />}
              >
                <ObjectWrapper objectType="home" playerColor={piece.playerColor}>
                  <Piece piece={piece} onClick={pieceOnClick(rowIndex(), columnIndex())} />
                </ObjectWrapper>
              </Show>
            )}
          </For>
        )}
      </For>
    </div>
  );
};

export default Board;
