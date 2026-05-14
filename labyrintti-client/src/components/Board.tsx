import { createElementSize } from "@solid-primitives/resize-observer";
import { Component, createMemo, createSignal, For } from "solid-js";
import { GamePieceWithObject } from "../types";
import { playerColors } from "../pieces";
import PieceSwitch from "./PieceSwitch";
import ObjectWrapper from "./ObjectWrapper";

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

  const shouldBeHomePiece = (x: number, y: number) => {
    if (y === 0 && x === 0) return true;
    if (y === 0 && x === props.columns - 1) return true;
    if (x === 0 && y === props.rows - 1) return true;
    if (x === props.columns - 1 && y === props.rows - 1) return true;
    return false;
  };

  const pieces = createMemo<GamePieceWithObject[][]>(() => {
    const result: GamePieceWithObject[][] = [];
    let colorIndex = 0;
    for (let y = 0; y < props.rows; ++y) {
      result.push([]);
      for (let x = 0; x < props.columns; ++x) {
        if (shouldBeHomePiece(x, y)) {
          result[y].push({
            type: "L",
            orientation: getHomePieceOrientation(x, y),
            hasObject: true,
            playerColor: playerColors[colorIndex],
          });
          colorIndex = colorIndex + 1;
        } else {
          result[y].push({ type: randomPieceType(), orientation: randomOrientation() });
        }
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
        {(row) => (
          <For each={row}>
            {(piece) =>
              piece.hasObject ? (
                <ObjectWrapper objectType="home" playerColor={piece.playerColor}>
                  <PieceSwitch piece={piece} />
                </ObjectWrapper>
              ) : (
                <PieceSwitch piece={piece} />
              )
            }
          </For>
        )}
      </For>
    </div>
  );
};

export default Board;
