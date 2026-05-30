import { Component } from "solid-js";
import { GamePiece } from "../types";
import clsx from "clsx";
import { orientationToStyle } from "../util/pieceUtils";
import PieceShapeSwitch from "./PieceShapeSwitch";

interface Props {
  piece: GamePiece;
  onClick?: (piece: GamePiece) => void;
}

const Piece: Component<Props> = (props) => {
  const clickable = () => props.onClick != null;

  return (
    <div
      class={clsx("w-full h-full rounded bg-orange-500 border-2 border-gray-700", {
        "cursor-pointer hover:bg-orange-600": clickable(),
      })}
      style={{ transform: orientationToStyle(props.piece.orientation) }}
      onClick={() => props.onClick?.(props.piece)}
    >
      <PieceShapeSwitch piece={props.piece} />
    </div>
  );
};

export default Piece;
