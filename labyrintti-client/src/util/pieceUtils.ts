import { GamePiece } from "../types";

export const orientationToStyle = (orientation: GamePiece["orientation"]): string => {
  return (
    {
      up: "rotate(0deg)",
      right: "rotate(90deg)",
      down: "rotate(180deg)",
      left: "rotate(270deg)",
    }[orientation] ?? ""
  );
};
