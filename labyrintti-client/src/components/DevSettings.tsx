import { Component, createSignal, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { useGameSettings } from "../contexts/GameSettingsContext";
import { useGameState } from "../contexts/GameStateContext";

const DevSettings: Component = () => {
  const [open, setOpen] = createSignal(false);
  const [gameSettings, { toggleBots }] = useGameSettings();
  const [, { initializeGame }] = useGameState();

  return (
    <div class="flex flex-col items-start pt-1">
      <button
        onClick={() => setOpen(true)}
        class="text-[10px] font-semibold tracking-wide text-gray-300 hover:text-white bg-gray-900/60 hover:bg-gray-900/80 px-2 py-1 rounded transition-colors"
      >
        DEV
      </button>
      <Show when={open()}>
        <Portal>
          <div class="fixed inset-0 bg-black/75 z-50 flex items-center justify-center">
            <div class="bg-zinc-950 border-4 border-zinc-300 w-[580px] font-mono">
              <div class="bg-zinc-300 text-zinc-950 text-center py-3 px-6">
                <span class="text-lg font-bold tracking-[0.3em]">DEV SETTINGS</span>
              </div>

              <div class="p-10 flex flex-col gap-8">
                <div>
                  <div class="text-zinc-500 text-xs tracking-[0.2em] mb-3">GAMEPLAY</div>
                  <div class="flex items-center justify-between py-5 border-y border-zinc-800">
                    <span class="text-zinc-100 text-2xl tracking-wide">Bots</span>
                    <button
                      onClick={() => toggleBots()}
                      class="text-2xl font-bold tracking-widest w-36 text-center transition-colors"
                      classList={{
                        "text-green-400": gameSettings.botsEnabled,
                        "text-zinc-600": !gameSettings.botsEnabled,
                      }}
                    >
                      ◄ {gameSettings.botsEnabled ? "ON " : "OFF"} ►
                    </button>
                  </div>
                </div>

                <div class="flex justify-between">
                  <button
                    onClick={() => { initializeGame(); setOpen(false); }}
                    class="border-2 border-zinc-600 text-zinc-500 hover:border-red-500 hover:text-red-400 px-8 py-2 text-sm tracking-[0.25em] transition-colors"
                  >
                    RESET
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    class="border-2 border-zinc-500 text-zinc-400 hover:border-zinc-200 hover:text-zinc-100 px-8 py-2 text-sm tracking-[0.25em] transition-colors"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
    </div>
  );
};

export default DevSettings;
