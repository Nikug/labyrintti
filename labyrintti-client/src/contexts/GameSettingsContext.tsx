import { Component, createContext, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export interface GameSettingsContextValues {
  botsEnabled: boolean;
}

export interface GameSettingsContextMethods {
  toggleBots: () => void;
}

export type GameSettingsContext = [GameSettingsContextValues, GameSettingsContextMethods];

export const GameSettingsContext = createContext<GameSettingsContext>([
  { botsEnabled: false },
  { toggleBots: () => {} },
]);

export const useGameSettings = () => useContext(GameSettingsContext);

interface ProviderProps {
  children: JSX.Element;
}

export const GameSettingsProvider: Component<ProviderProps> = (props) => {
  const [settings, setSettings] = createStore<GameSettingsContextValues>({
    botsEnabled: false,
  });

  const contextValue: GameSettingsContext = [
    settings,
    { toggleBots: () => setSettings("botsEnabled", (enabled) => !enabled) },
  ];

  return (
    <GameSettingsContext.Provider value={contextValue}>
      {props.children}
    </GameSettingsContext.Provider>
  );
};
