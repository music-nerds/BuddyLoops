import React, { useContext, useRef, useState, useEffect, useCallback } from "react";
import { ReactAudioContext, SocketContext } from "../app";
import { useHistory } from "react-router-dom";
import { audition } from "../audio/audioFunctions";
import "./stepRow.css";
// import { BeatState } from "../redux/store";
// import { connect } from "react-redux";
import AuditionSquare from './auditionSquare';

interface Props {
  selectPattern: (pattern: number) => void;
  currPattern: number;
}

const Audition: React.FC<Props> = ({ selectPattern, currPattern }) => {
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

  const startAudition = useCallback((
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
  }, [selectPattern, setSelectedNum, context, socket, socketID]);

  const endAudtion = useCallback((
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: number
  ) => {
    event.preventDefault();
    context.endAudition(id);
    setSelectedNum(-1);
    socket.emit("sendMomentaryOff", socketID, id);
  }, [context, socket, setSelectedNum, socketID]);

  const auditionEndUp = useCallback((
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: number
  ) => {
    mouseDown.current = false;
    endAudtion(event, id);
  }, [endAudtion]);

  const auditionEndLeave = useCallback((
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: number
  ) => {
    endAudtion(event, id);
  }, [endAudtion]);

  const auditionEndLeaveSampler = useCallback((
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    setSelectedNum(-1);
    mouseDown.current = false;
  }, [setSelectedNum]);

  const auditionStart = useCallback((
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    mouseDown.current = true;
    startAudition(event);
  }, [startAudition]);

  const auditionStartEnter = useCallback((
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (mouseDown.current) {
      startAudition(event);
    }
  }, [startAudition]);

  const touchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    mouseDown.current = true;
    curDiv.current = e.target as HTMLDivElement;
    startAudition(e);
  }, [startAudition]);

  const touchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
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
  }, [selectPattern, setSelectedNum, context, socket, socketID]);

  const touchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
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
  }, [setSelectedNum, context, socket, socketID]);

  console.log('AUDITION RENDERING');
  return (
    <div onMouseLeave={auditionEndLeaveSampler}>
      {new Array(16).fill(null).map((n, idx) =>
        context.sequencers[idx] ? (
          <AuditionSquare
            key={idx}
            idx={idx}
            currPattern={currPattern}
            selectedNum={selectedNum}
            auditionEndLeave={auditionEndLeave}
            auditionEndUp={auditionEndUp}
            auditionStart={auditionStart}
            touchEnd={touchEnd}
            auditionStartEnter={auditionStartEnter}
            touchMove={touchMove}
            touchStart={touchStart}
          />
        ) : (
          <div key={idx} className="seq-square"></div>
        )
      )}
    </div>
  );
};

// const mapState = (state:BeatState)=> state;

// export default connect(mapState, {})(Audition);
export default Audition;