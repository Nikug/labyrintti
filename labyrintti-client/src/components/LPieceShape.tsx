import { Component } from "solid-js";

const LPieceShape: Component = () => {
  return (
    <svg viewBox="0 0 100 100" class="w-full h-full">
      <path
        d="M 25 0 L 25 25 L 0 25 L 0 75 L 75 75 L 75 0 Z"
        fill="white"
        stroke="black"
        stroke-width="2"
      />
    </svg>
  );
};

export default LPieceShape;
