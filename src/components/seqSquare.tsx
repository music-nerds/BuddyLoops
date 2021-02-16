import React from "react";
import { connect } from "react-redux";
import { BeatState } from "../redux/store";

interface SquareProps {
  beat: number;
  index: number;
  handleMouseOut: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleDrag: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleToggle: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  enabled: 0 | 1;
  sequencersArePlaying: boolean;
}

const SeqSquare: React.FC<SquareProps> = ({
  beat,
  index,
  handleToggle,
  handleDrag,
  handleMouseOut,
  handleMouseUp,
  enabled,
  sequencersArePlaying,
}) => {
  return (
    <div
      data-index={index}
      className={`seq-square ${
        sequencersArePlaying && beat === index ? "active-beat" : ""
      }`}
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

const mapState = (state:BeatState) => state;

export default React.memo(connect(mapState, {})(SeqSquare));
