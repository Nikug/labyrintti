import { Component } from "solid-js";
import { GamePiece } from "../types";
import { orientationToStyle } from "../pieceUtils";

interface Props {
  piece: GamePiece;
}

const LShapePiece: Component<Props> = (props) => {
  return (
    <div
      class="w-full h-full rounded bg-orange-500 border-2 border-gray-700"
      style={{ transform: orientationToStyle(props.piece.orientation) }}
    >
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <path
          d="M 25 0 L 25 25 L 0 25 L 0 75 L 75 75 L 75 0 Z"
          fill="white"
          stroke="black"
          stroke-width="2"
        />
      </svg>
    </div>
  );
};

export default LShapePiece;
