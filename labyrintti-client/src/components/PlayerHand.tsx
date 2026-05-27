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

  const activePlayer = () => game.players[game.activePlayer];

  return (
    <div class="flex flex-col items-center gap-1">
      <p class="font-semibold" style={{ color: activePlayer()?.color }}>
        Player {game.activePlayer + 1}
      </p>
      <p class="text-sm text-gray-400">
        {game.phase === "push" ? "Push a tile into the board" : "Move your piece"}
      </p>
      <p class="text-xs text-gray-500">Click piece to rotate</p>
      <div class="w-48 h-48">
        <Piece piece={game.extraPiece} onClick={handleRotate} />
      </div>
    </div>
  );
};

export default PlayerHand;
