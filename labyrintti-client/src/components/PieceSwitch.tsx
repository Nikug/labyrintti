import { Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { GamePiece } from "../types";
import LShapePiece from "./LShapePiece";
import IShapePiece from "./IShapePiece";
import TShapePiece from "./TShapePiece";

interface PieceProps {
  piece: GamePiece;
}

const pieces = {
  L: (props: PieceProps) => <LShapePiece piece={props.piece} />,
  I: (props: PieceProps) => <IShapePiece piece={props.piece} />,
  T: (props: PieceProps) => <TShapePiece piece={props.piece} />,
};

interface Props {
  piece: GamePiece;
}

const PieceSwitch: Component<Props> = (props) => {
  return <Dynamic component={pieces[props.piece.type]} piece={props.piece} />;
};

export default PieceSwitch;
