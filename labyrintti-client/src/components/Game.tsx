import { Component } from "solid-js";
import { useBotPlayer } from "../hooks/useBotPlayer";
import Board from "./Board";
import PlayerHand from "./PlayerHand";
import DevSettings from "./DevSettings";

const Game: Component = () => {
  useBotPlayer();

  return (
    <div class="w-screen h-screen flex justify-start items-center flex-col pt-8 gap-4">
      <div class="w-150">
        <Board rows={7} columns={7} />
        <DevSettings />
      </div>
      <div>
        <PlayerHand />
      </div>
    </div>
  );
};

export default Game;
