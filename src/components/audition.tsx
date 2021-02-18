import React, { useContext, useRef, useState, useEffect } from "react";
import { ReactAudioContext, SocketContext } from "../app";
import { useHistory } from "react-router-dom";
import { audition } from "../audio/audioFunctions";
import "./stepRow.css";

interface Props {
  selectPattern: (pattern: number) => void;
  beat: number;
  currPattern: number;
}

const Audition: React.FC<Props> = ({ selectPattern, beat, currPattern }) => {
  const { context } = useContext(ReactAudioContext);
  const socket = useContext(SocketContext);
  const {
    location: { pathname },
  } = useHistory();
  const socketID = pathname.slice(1);

  const [selectedNum, setSelectedNum] = useState(-1);
  const mouseDown: React.MutableRefObject<boolean> = useRef(false);
  const curDiv: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const prevDiv: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

  useEffect(() => {
    return () => {
      context.sequencers.forEach((seq) => {
        for (let i = 0; i < context.sequencers.length; i++) {
          context.endAudition(i);
          socket.emit("sendMomentaryOff", socketID, i);
        }
      });
    };
  }, [context, socket, socketID]);

  const startAudition = (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) => {
    const target = event.target as HTMLElement;
    const id: number = Number(target.dataset.index);
    selectPattern(id);
    setSelectedNum(id);
    if (!context.isPlaying) {
      audition(context, context.sequencers[id]);
    } else {
      context.setAudition(id);
      socket.emit("sendMomentaryOn", socketID, id);
    }
  };

  const endAudtion = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: number
  ) => {
    event.preventDefault();
    context.endAudition(id);
    setSelectedNum(-1);
    socket.emit("sendMomentaryOff", socketID, id);
  };

  const auditionEndUp = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: number
  ) => {
    mouseDown.current = false;
    endAudtion(event, id);
  };

  const auditionEndLeave = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: number
  ) => {
    endAudtion(event, id);
  };
  const auditionEndLeaveSampler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    setSelectedNum(-1);
    mouseDown.current = false;
  };

  const auditionStart = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    mouseDown.current = true;
    startAudition(event);
  };
  const auditionStartEnter = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (mouseDown.current) {
      startAudition(event);
    }
  };
  const touchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    mouseDown.current = true;
    curDiv.current = e.target as HTMLDivElement;
    startAudition(e);
  };
  const touchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const loc = e.changedTouches[0];
    const location = document.elementFromPoint(
      loc.clientX,
      loc.clientY
    ) as HTMLDivElement;

    prevDiv.current = curDiv.current;
    curDiv.current = location;

    if (location !== prevDiv.current) {
      const id: number = Number(location.dataset.index);
      const prevId: number = Number(prevDiv.current?.dataset.index);
      if (id) {
        selectPattern(id);
        setSelectedNum(id);
        if (!context.isPlaying) {
          context.endAudition(prevId);
          socket.emit("sendMomentaryOff", socketID, prevId);
          audition(context, context.sequencers[id]);
        } else {
          context.endAudition(prevId);
          socket.emit("sendMomentaryOff", socketID, prevId);
          context.setAudition(id);
          socket.emit("sendMomentaryOn", socketID, id);
        }
      } else {
        context.endAudition(prevId);
        socket.emit("sendMomentaryOff", socketID, prevId);
      }
    }
  };

  const touchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const loc = e.changedTouches[0];
    const location = document.elementFromPoint(
      loc.clientX,
      loc.clientY
    ) as HTMLDivElement;
    const id = Number(location.dataset.index);
    curDiv.current = null;
    prevDiv.current = null;
    mouseDown.current = false;
    setSelectedNum(-1);
    if (!id) {
      for (let i = 0; i < context.sequencers.length; i++) {
        context.endAudition(i);
        socket.emit("sendMomentaryOff", socketID, i);
      }
    } else {
      context.endAudition(id);
      socket.emit("sendMomentaryOff", socketID, id);
    }
  };

  return (
    <div onMouseLeave={auditionEndLeaveSampler}>
      {new Array(16).fill(null).map((n, idx) =>
        context.sequencers[idx] ? (
          <div
            key={idx}
            id={`${idx}`}
            onMouseDown={auditionStart}
            onMouseUp={(e) => auditionEndUp(e, idx)}
            onMouseLeave={(e) => auditionEndLeave(e, idx)}
            onMouseEnter={auditionStartEnter}
            onTouchStart={touchStart}
            onTouchMove={touchMove}
            onTouchEnd={touchEnd}
            style={{
              background: `${
                selectedNum === idx
                  ? "var(--blueGradientHL)"
                  : context.sequencers[idx].pattern[beat] === 1 &&
                    context.sequencersArePlaying
                  ? "var(--blueGradientHL)"
                  : "var(--blueGradient)"
              }`,
            }}
            className={`aud-square ${
              idx === currPattern ? "active-beat" : ""
            } `}
            data-index={idx}
          >
            {/* 
              ALL CHILD ELEMENTS NEED THE DATA INDEX PROPERTY
              OTHERWISE, IT WILL BREAK IF CLICKED ON. 
              E.TARGET IS THE MOST HIGHLY NESTED ELEMENT
            */}
            <span data-index={idx} className="sample-name">
              {context.sequencers[idx].name}
            </span>
          </div>
        ) : (
          <div key={idx} className="seq-square"></div>
        )
      )}
    </div>
  );
};

export default Audition;
