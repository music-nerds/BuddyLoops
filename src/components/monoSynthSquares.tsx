import React, { useContext, useState, useRef } from "react";
import { MonoSynth } from "../audio/synth";
import { ReactAudioContext, SocketContext } from "../app";
import { useHistory } from "react-router-dom";
import { BeatState } from "../redux/store";
import { connect } from "react-redux";

export interface MonoSynthSquaresProps {
  synth: MonoSynth;
  beat: number;
}

const MonoSynthSquares: React.SFC<MonoSynthSquaresProps> = ({
  synth,
  beat,
}) => {
  const [mouseDown, setMouseDown] = useState(false);
  const { context, setContext } = useContext(ReactAudioContext);
  const socket = useContext(SocketContext);
  const {
    location: { pathname },
  } = useHistory();
  const socketID = pathname.slice(1);
  const curDiv: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const prevDiv: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

  const handleToggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    const row = Number(target.dataset.row)!;
    const col = Number(target.dataset.col)!;
    const value = target.dataset.value!;
    if (value === "1") {
      target.dataset.value = "0";
      synth.updatePattern(0, row, col);
    } else {
      target.dataset.value = "1";
      synth.updatePattern(1, row, col);
    }
    if (!context.isPlaying) {
      setContext({ ...context });
    }
    socket.emit("synthPatternChange", socketID, synth.pattern);
  };
  const handleDragToggle = (target: HTMLDivElement) => {
    const row = Number(target.dataset.row)!;
    const col = Number(target.dataset.col)!;
    const value = target.dataset.value!;
    if (value === "1") {
      target.dataset.value = "0";
      synth.updatePattern(0, row, col);
    } else {
      target.dataset.value = "1";
      synth.updatePattern(1, row, col);
    }
    if (!context.isPlaying) {
      setContext({ ...context });
    }
    socket.emit("synthPatternChange", socketID, synth.pattern);
  };
  const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mouseDown) {
      handleToggle(e);
    }
  };
  const touchDown = (e: React.TouchEvent<HTMLDivElement>) => {
    curDiv.current = e.target as HTMLDivElement;
  };
  const touchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const loc = e.changedTouches[0];
    const location = document.elementFromPoint(
      loc.clientX,
      loc.clientY
    ) as HTMLDivElement;
    if (prevDiv.current === null) {
      handleDragToggle(location);
    }
    prevDiv.current = curDiv.current;
    curDiv.current = location;
    if (location !== prevDiv.current) {
      handleDragToggle(location);
    }
  };
  const touchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    curDiv.current = null;
    prevDiv.current = null;
  };

  return (
    <div
      className="synth-squares"
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
      onMouseLeave={() => setMouseDown(false)}
      onTouchStart={touchDown}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      style={{
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {synth.pattern.map((row, i) => (
        <div
          className="synth-square-row"
          key={i}
          style={{
            userSelect: "none",
            touchAction: "none",
          }}
        >
          {row.map((col, j) => (
            <div
              className={`synth-square ${col === 1 ? "active-square" : ""} ${
                synth.isPlaying && i === beat ? "active-beat" : ""
              } ${i % 4 === 0 ? "on-beat" : ""}`}
              data-row={i}
              data-col={j}
              data-value={col}
              onMouseDown={handleToggle}
              key={j}
              onMouseEnter={handleDrag}
              style={{ userSelect: "none", touchAction: "none" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const mapState = (state:BeatState)=> state;

export default connect(mapState, {})(MonoSynthSquares);
