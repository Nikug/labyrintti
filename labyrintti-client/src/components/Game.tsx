import { Component, Show } from "solid-js";
import { useBotPlayer } from "../hooks/useBotPlayer";
import { useGameState } from "../contexts/GameStateContext";
import Board from "./Board";
import PlayerHand from "./PlayerHand";
import DevSettings from "./DevSettings";

const Game: Component = () => {
  useBotPlayer();
  const [gameState, { initializeGame }] = useGameState();

  return (
    <>
      <Show when={gameState.game.winner !== null}>
        <div class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div class="bg-zinc-950 border-4 border-zinc-300 w-[500px] font-mono">
            <div class="bg-zinc-300 text-zinc-950 text-center py-3">
              <span class="text-lg font-bold tracking-[0.3em]">GAME OVER</span>
            </div>
            <div class="p-12 flex flex-col gap-8 items-center">
              <p class="text-zinc-100 text-3xl font-bold tracking-wide">
                Player {(gameState.game.winner ?? 0) + 1} wins!
              </p>
              <button
                onClick={() => initializeGame()}
                class="border-2 border-zinc-500 text-zinc-400 hover:border-zinc-200 hover:text-zinc-100 px-10 py-3 text-sm tracking-[0.25em] transition-colors"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        </div>
      </Show>
      <div class="w-screen h-screen flex justify-start items-center flex-col pt-8 gap-4">
        <div class="w-150">
          <Board rows={7} columns={7} />
          <DevSettings />
        </div>
        <div>
          <PlayerHand />
        </div>
      </div>
    </>
  );
};

export default Game;
