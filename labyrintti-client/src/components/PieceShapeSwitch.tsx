import { Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { GamePiece } from "../types";
import LPieceShape from "./LPieceShape";
import IPieceShape from "./IPieceShape";
import TPieceShape from "./TPieceShape";

const pieces = {
  L: () => <LPieceShape />,
  I: () => <IPieceShape />,
  T: () => <TPieceShape />,
};

interface Props {
  piece: GamePiece;
}

const PieceShapeSwitch: Component<Props> = (props) => {
  return <Dynamic component={pieces[props.piece.type]} />;
};

export default PieceShapeSwitch;
