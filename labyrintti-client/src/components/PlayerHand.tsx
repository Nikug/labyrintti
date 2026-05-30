import { Component, For } from "solid-js";
import { useGameState } from "../contexts/GameStateContext";
import { Direction, GamePiece } from "../types";
import Piece from "./Piece";
import ObjectWrapper from "./ObjectWrapper";

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
      <div class="flex gap-1.5 h-7 items-center">
        <For each={activePlayer()?.targetItems}>
          {(item) => (
            <span
              class="text-xl transition-opacity"
              classList={{ "opacity-20": activePlayer()?.collectedItems.includes(item) }}
            >
              {item}
            </span>
          )}
        </For>
      </div>
      <p class="text-xs text-gray-500">Click piece to rotate</p>
      <div class="relative w-48 h-48">
        <ObjectWrapper object={game.extraPiece?.object}>
          <Piece piece={game.extraPiece} onClick={handleRotate} />
        </ObjectWrapper>
      </div>
    </div>
  );
};

export default PlayerHand;
