import { createElementSize } from "@solid-primitives/resize-observer";
import { Component, createMemo, createSignal, For } from "solid-js";
import { GamePiece } from "../types";
import PieceSwitch from "./PieceSwitch";

interface Props {
  rows: number;
  columns: number;
}

const Board: Component<Props> = (props) => {
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const containerSize = createElementSize(containerRef);

  const randomOrientation = () => {
    return ["up", "down", "left", "right"][
      Math.floor(Math.random() * 4)
    ] as GamePiece["orientation"];
  };

  const randomPieceType = () => {
    return ["L", "I", "T"][Math.floor(Math.random() * 3)] as GamePiece["type"];
  };

  const pieces = createMemo<GamePiece[][]>(() => {
    const result: GamePiece[][] = [];
    for (let y = 0; y < props.rows; ++y) {
      result.push([]);
      for (let x = 0; x < props.columns; ++x) {
        result[y].push({ type: randomPieceType(), orientation: randomOrientation() });
      }
    }

    return result;
  });

  return (
    <div
      ref={setContainerRef}
      class="w-full aspect-square grid gap-1"
      style={{
        "grid-template-columns": `repeat(${props.columns}, 1fr)`,
        "grid-template-rows": `repeat(${props.rows}, 1fr)`,
      }}
    >
      <For each={pieces()}>
        {(row) => <For each={row}>{(piece) => <PieceSwitch piece={piece} />}</For>}
      </For>
    </div>
  );
};

export default Board;
