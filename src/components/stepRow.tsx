import React, { useRef, useContext, useState } from "react";
import { SocketContext } from "../app";
import { StepRow } from "../audio/createContext";
import "./stepRow.css";

import SeqSquare from "./seqSquare";

interface RowProps {
  row: StepRow;
  id: string;
  beat: number;
}

const Row: React.FC<RowProps> = ({ row, id, beat }) => {
  const socket = useContext(SocketContext);
  const [mouseDown, setMouseDown] = useState(false);
  const div: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const curDiv: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const prevDiv: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const bool = useRef(false);

  const handleToggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    const index = Number(target.dataset.index)!;
    target.classList.add("active-square");
    if (row.pattern[index] === 0) {
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
    if (row.pattern[index] === 0) {
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
  const down = () => {
    bool.current = true;
    setMouseDown(true);
  };
  const up = () => {
    setMouseDown(false);
    bool.current = false;
  };
  const touchDown = (e: React.TouchEvent<HTMLDivElement>) => {
    curDiv.current = e.target as HTMLDivElement;
    curDiv.current.classList.add("active-square");
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
    if (!location.classList.contains("active-square")) {
      location.classList.add("active-square");
    }
    if (location !== prevDiv.current) {
      handleDragToggle(location);
      prevDiv.current?.classList.remove("active-square");
    }
  };
  const touchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    curDiv.current?.classList.remove("active-square");
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
      style={{
        userSelect: "none",
      }}
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
