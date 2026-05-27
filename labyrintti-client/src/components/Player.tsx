import { Component } from "solid-js";

interface Props {
  color: string;
}

const Player: Component<Props> = (props) => {
  return (
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        class="w-2/5 h-2/5 rounded-full border-2 border-white shadow-md"
        style={{ background: props.color }}
      />
    </div>
  );
};

export default Player;
