import React, { useContext, useEffect } from "react";
import { MonoSynth } from "../audio/synth";
import { ReactAudioContext, SocketContext } from "../app";
import { useHistory } from "react-router-dom";

export interface MonoSynthSquaresProps {
  synth: MonoSynth;
  beat: number;
}

const MonoSynthSquares: React.SFC<MonoSynthSquaresProps> = ({
  synth,
  beat,
}) => {
  const { context, setContext } = useContext(ReactAudioContext);
  const socket = useContext(SocketContext);
  const {
    location: { pathname },
  } = useHistory();
  const socketID = pathname.slice(1);

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

  useEffect(() => {
    socket.on("synthPatternChange", (pattern: (0 | 1)[][]) => {
      synth.pattern = pattern;
      if (!context.isPlaying) {
        setContext({ ...context });
      }
      console.log(synth.pattern);
    });
    return () => {
      socket.off("synthPatternChange");
    };
  }, [socket, context, setContext, synth]);

  return (
    <div className="synth-squares">
      {synth.pattern.map((row, i) => (
        <div className="synth-square-row" key={i}>
          {row.map((col, j) => (
            <div
              className={`synth-square ${col === 1 ? "active-square" : ""} ${
                i === beat ? "active-beat" : ""
              }`}
              data-row={i}
              data-col={j}
              data-value={col}
              onClick={handleToggle}
              key={j}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MonoSynthSquares;
