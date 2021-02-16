import React, { useRef, useContext, useState, useCallback } from "react";
import { SocketContext, ReactAudioContext } from "../app";
import { StepRow } from "../audio/createContext";
import "./stepRow.css";

import SeqSquare from "./seqSquare";

interface RowProps {
  row: StepRow;
  id: string;
}

const Row: React.FC<RowProps> = ({ row, id }) => {
  const socket = useContext(SocketContext);
  const {
    context: { sequencersArePlaying },
  } = useContext(ReactAudioContext);
  const [mouseDown, setMouseDown] = useState(false);
  const div: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const curDiv: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const prevDiv: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

  const handleToggle = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
  }, [id, row.name, row.pattern, socket]);

  const handleDragToggle = useCallback((target: HTMLDivElement) => {
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
  }, [row.pattern, id, socket, row.name]);

  const down = () => {
    setMouseDown(true);
  };
  const up = () => {
    setMouseDown(false);
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

  const handleDrag = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    if (mouseDown) {
      handleToggle(e);
      target.classList.add("active-square");
    }
  }, [handleToggle, mouseDown]);

  const handleMouseOut = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    if (mouseDown) {
      target.classList.remove("active-square");
    }
  }, [mouseDown]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    target.classList.remove("active-square");
  }, []);

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
            handleDrag={handleDrag}
            handleMouseOut={handleMouseOut}
            handleMouseUp={handleMouseUp}
            enabled={enabled}
            index={idx}
            key={idx}
            sequencersArePlaying={sequencersArePlaying}
          />
        );
      })}
    </div>
  );
};

export default React.memo(Row);
