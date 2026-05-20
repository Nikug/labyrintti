import { Component } from "solid-js";

const IPieceShape: Component = () => {
  return (
    <svg viewBox="0 0 100 100" class="w-full h-full">
      <path d="M 25 0 L 25 100 L 75 100 L 75 0 Z" fill="white" stroke="black" stroke-width="2" />
    </svg>
  );
};

export default IPieceShape;
