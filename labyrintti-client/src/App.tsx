import { Component } from "solid-js";
import { GameStateProvider } from "./contexts/GameStateContext";
import { GameSettingsProvider } from "./contexts/GameSettingsContext";
import Game from "./components/Game";

const App: Component = () => {
  return (
    <GameSettingsProvider>
      <GameStateProvider>
        <Game />
      </GameStateProvider>
    </GameSettingsProvider>
  );
};

export default App;
