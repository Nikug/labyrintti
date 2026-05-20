import { Component } from "solid-js";
import PieceSwitch from "./PieceSwitch";
import { useGameState } from "../contexts/GameStateContext";
import { Direction, GamePiece } from "../types";

const PlayerHand: Component = () => {
  const [{ game }, { rotateExtraPiece }] = useGameState();

  const handleRotate = (piece: GamePiece) => {
    const newOrientation = {
      up: "right",
      right: "down",
      down: "left",
      left: "up",
    }[piece.orientation] as Direction;

    rotateExtraPiece(newOrientation);
  };

  return (
    <div class="flex flex-col items-center">
      <p>Click piece to rotate</p>
      <div class="w-48 h-48">
        <PieceSwitch piece={game.extraPiece} onClick={handleRotate} />
      </div>
    </div>
  );
};

export default PlayerHand;
