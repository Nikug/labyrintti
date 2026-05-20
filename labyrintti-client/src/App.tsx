import type { Component } from "solid-js";
import Board from "./components/Board";
import { GameStateProvider } from "./contexts/GameStateContext";
import PlayerHand from "./components/PlayerHand";

const App: Component = () => {
  return (
    <GameStateProvider>
      <div class="w-screen h-screen flex justify-start items-center flex-col mt-8 gap-4">
        <div class="w-150">
          <Board rows={7} columns={7} />
        </div>
        <div>
          <PlayerHand />
        </div>
      </div>
    </GameStateProvider>
  );
};

export default App;
