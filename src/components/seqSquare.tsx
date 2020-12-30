import React from "react";

interface SquareProps {
  beat: number;
  index: number;
  handleToggle: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  enabled: 0 | 1;
  mouseDown: boolean;
}

const SeqSquare: React.FC<SquareProps> = ({
  beat,
  index,
  handleToggle,
  enabled,
  mouseDown,
}) => {
  const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mouseDown) {
      handleToggle(e);
    }
  };
  return (
    <div
      data-index={index}
      className={`seq-square ${beat === index ? "active-beat" : ""}`}
      aria-checked={enabled === 1 ? "true" : "false"}
      onMouseDown={handleToggle}
      onMouseOver={handleDrag}
      style={{
        userSelect: "none",
      }}
    />
  );
};

export default SeqSquare;
