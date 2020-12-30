import React, { useRef, useContext, useState } from "react";
// import { useHistory } from "react-router-dom";
import { SocketContext } from "../app";
import { StepRow } from "../audio/createContext";
import "./stepRow.css";
// import LaunchButton from './launchBtn';

import SeqSquare from "./seqSquare";

interface RowProps {
  row: StepRow;
  id: string;
  beat: number;
}

// interface PatternChange {
//   name: string;
//   pattern: (0|1)[];
//   id: string;
// }

const Row: React.FC<RowProps> = ({ row, id, beat }) => {
  const socket = useContext(SocketContext);
  const [mouseDown, setMouseDown] = useState(false);

  // const handleLaunch = () => {
  //   socket.emit('sendRowLaunch', id, row.name)
  // }

  const handleToggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    const index = Number(target.getAttribute("data-index"))!;
    if (target.getAttribute("aria-checked") === "false") {
      target.setAttribute("aria-checked", "true");
      row.pattern[index] = 1;
    } else {
      target.setAttribute("aria-checked", "false");
      row.pattern[index] = 0;
    }
    socket.emit("patternChange", id, {
      name: row.name,
      pattern: row.pattern,
      id,
    });
  };

  const div: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const bool = useRef(false);
  const down = () => {
    bool.current = true;
    setMouseDown(true);
    console.log("DOWN");
  };
  const up = () => {
    setMouseDown(false);
    bool.current = false;
    console.log("UP");
  };
  return (
    <div ref={div} onMouseDown={down} onMouseUp={up} onMouseLeave={up}>
      {row.pattern.map((enabled, idx) => {
        return (
          <SeqSquare
            handleToggle={handleToggle}
            enabled={enabled}
            index={idx}
            beat={beat}
            key={idx}
            mouseDown={mouseDown}
          />
        );
      })}
    </div>
  );
};

export default Row;
