import { Component, For, onMount, Show } from "solid-js";
import PieceSwitch from "./PieceSwitch";
import ObjectWrapper from "./ObjectWrapper";
import { useGameState } from "../contexts/GameStateContext";
import { GamePiece } from "../types";

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
    if (rowIndex === 0) {
      return (piece: GamePiece) => {
        playPiece(piece, { x: columnIndex, y: rowIndex }, "down");
      };
    } else if (rowIndex === gameState.settings.rows - 1) {
      return (piece: GamePiece) => {
        playPiece(piece, { x: columnIndex, y: rowIndex }, "up");
      };
    } else if (columnIndex === 0) {
      return (piece: GamePiece) => {
        playPiece(piece, { x: columnIndex, y: rowIndex }, "right");
      };
    } else if (columnIndex === gameState.settings.columns - 1) {
      return (piece: GamePiece) => {
        playPiece(piece, { x: columnIndex, y: rowIndex }, "left");
      };
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
                fallback={
                  <PieceSwitch piece={piece} onClick={pieceOnClick(rowIndex(), columnIndex())} />
                }
              >
                <ObjectWrapper objectType="home" playerColor={piece.playerColor}>
                  <PieceSwitch piece={piece} onClick={pieceOnClick(rowIndex(), columnIndex())} />
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
