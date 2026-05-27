import { Component } from "solid-js";

type Variant = "reachable" | "valid" | "undo";

interface Props {
  variant: Variant;
}

const variantClass: Record<Variant, string> = {
  reachable: "bg-green-400/40",
  valid: "bg-blue-400/30",
  undo: "bg-red-500/40",
};

const HighlightPiece: Component<Props> = (props) => {
  return <div class={`absolute inset-0 pointer-events-none ${variantClass[props.variant]}`} />;
};

export default HighlightPiece;
