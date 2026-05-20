import type { Component } from "solid-js";
import Board from "./components/Board";
import { GameStateProvider } from "./contexts/GameStateContext";

const App: Component = () => {
  return (
    <GameStateProvider>
      <div class="w-screen h-screen flex justify-center">
        <div class="w-150">
          <Board rows={7} columns={7} />
        </div>
      </div>
    </GameStateProvider>
  );
};

export default App;
