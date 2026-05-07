import type { Component } from "solid-js";
import Board from "./components/Board";

const App: Component = () => {
  return (
    <div class="w-screen h-screen flex justify-center">
      <div class="w-150">
        <Board rows={7} columns={7} />
      </div>
    </div>
  );
};

export default App;
