import { createEffect, onCleanup } from "solid-js";
import { useGameState } from "../contexts/GameStateContext";
import { useGameSettings } from "../contexts/GameSettingsContext";
import { pickBotPush, pickBotMove } from "../util/botPlayer";

const BOT_DELAY_MS = 1400;

export function useBotPlayer() {
  const [gameState, { playPiece, movePlayer }] = useGameState();
  const [gameSettings] = useGameSettings();

  createEffect(() => {
    if (!gameSettings.botsEnabled) return;
    if (gameState.game.winner !== null) return;
    const activeIdx = gameState.game.activePlayer;
    const phase = gameState.game.phase;
    const active = gameState.game.players[activeIdx];
    if (!active?.isBot) return;

    const capturedPhase = phase;
    const capturedIdx = activeIdx;

    const timer = setTimeout(() => {
      if (capturedPhase === "push") {
        const action = pickBotPush(gameState.game, gameState.settings);
        if (action) playPiece(action.position, action.direction);
      } else {
        const pos = gameState.game.players[capturedIdx]?.position;
        if (pos) movePlayer(pickBotMove(gameState.game.board, pos));
      }
    }, BOT_DELAY_MS);

    onCleanup(() => clearTimeout(timer));
  });
}
