import { Component, For, onMount, Show } from "solid-js";
import PieceSwitch from "./PieceSwitch";
import ObjectWrapper from "./ObjectWrapper";
import { useGameState } from "../contexts/GameStateContext";

interface Props {
  rows: number;
  columns: number;
}

const Board: Component<Props> = (props) => {
  const [gameState, { initializeGame }] = useGameState();

  onMount(() => {
    initializeGame();
  });

  return (
    <div
      class="w-full aspect-square grid gap-1"
      style={{
        "grid-template-columns": `repeat(${props.columns}, 1fr)`,
        "grid-template-rows": `repeat(${props.rows}, 1fr)`,
      }}
    >
      <For each={gameState.game.board}>
        {(row) => (
          <For each={row}>
            {(piece) => (
              <Show when={piece.hasObject} fallback={<PieceSwitch piece={piece} />}>
                <ObjectWrapper objectType="home" playerColor={piece.playerColor}>
                  <PieceSwitch piece={piece} />
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
