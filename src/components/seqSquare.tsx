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
    const target = e.target as HTMLDivElement;
    if (mouseDown) {
      handleToggle(e);
      target.classList.add("active-square");
    }
  };
  const handleMouseOut = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    if (mouseDown) {
      target.classList.remove("active-square");
    }
  };
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    target.classList.remove("active-square");
  };
  return (
    <div
      data-index={index}
      className={`seq-square ${beat === index ? "active-beat" : ""}`}
      aria-checked={enabled === 1 ? "true" : "false"}
      onMouseDown={handleToggle}
      onMouseLeave={handleMouseOut}
      onMouseEnter={handleDrag}
      onMouseUp={handleMouseUp}
      style={{
        userSelect: "none",
      }}
    />
  );
};

export default SeqSquare;
