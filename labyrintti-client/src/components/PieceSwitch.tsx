import { Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { GamePiece } from "../types";
import LShapePiece from "./LShapePiece";
import IShapePiece from "./IShapePiece";
import TShapePiece from "./TShapePiece";

interface PieceProps {
  piece: GamePiece;
  onClick?: (piece: GamePiece) => void;
}

const pieces = {
  L: (props: PieceProps) => <LShapePiece piece={props.piece} onClick={props.onClick} />,
  I: (props: PieceProps) => <IShapePiece piece={props.piece} onClick={props.onClick} />,
  T: (props: PieceProps) => <TShapePiece piece={props.piece} onClick={props.onClick} />,
};

interface Props {
  piece: GamePiece;
  onClick?: (piece: GamePiece) => void;
}

const PieceSwitch: Component<Props> = (props) => {
  return (
    <Dynamic component={pieces[props.piece.type]} piece={props.piece} onClick={props.onClick} />
  );
};

export default PieceSwitch;
