import { Component } from "solid-js";
import { useGameState } from "../contexts/GameStateContext";
import { Direction, GamePiece } from "../types";
import Piece from "./Piece";

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
        <Piece piece={game.extraPiece} onClick={handleRotate} />
      </div>
    </div>
  );
};

export default PlayerHand;
