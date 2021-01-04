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
  // const [toggleIndex, setToggleIndex] = useState<string | undefined>(undefined);
  // const handleLaunch = () => {
  //   socket.emit('sendRowLaunch', id, row.name)
  // }

  const handleToggle = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) => {
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

  const handleDragToggle = (target: HTMLDivElement) => {
    const index = Number(target.dataset.index);
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
  const curDiv: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const prevDiv: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
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
  const touchDown = (e: React.TouchEvent<HTMLDivElement>) => {
    curDiv.current = e.target as HTMLDivElement;
    console.log("TOUCHDOWN", curDiv.current);
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
    } else {
      // prevDiv.current = null;
    }
  };
  const touchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    curDiv.current = null;
    prevDiv.current = null;
  };
  return (
    <div
      ref={div}
      onMouseDown={down}
      onTouchStart={touchDown}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      onMouseUp={up}
      onMouseLeave={up}
    >
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
