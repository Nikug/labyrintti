import { Component } from "solid-js";
import { GamePiece } from "../types";
import { orientationToStyle } from "../pieceUtils";
import clsx from "clsx";

interface Props {
  piece: GamePiece;
  onClick?: (piece: GamePiece) => void;
}

const IShapePiece: Component<Props> = (props) => {
  const clickable = () => props.onClick != null;

  return (
    <div
      class={clsx("w-full h-full rounded bg-orange-500 border-2 border-gray-700", {
        "cursor-pointer hover:bg-orange-600": clickable(),
      })}
      style={{ transform: orientationToStyle(props.piece.orientation) }}
      onClick={() => props.onClick?.(props.piece)}
    >
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <path d="M 25 0 L 25 100 L 75 100 L 75 0 Z" fill="white" stroke="black" stroke-width="2" />
      </svg>
    </div>
  );
};

export default IShapePiece;
