import React, { useRef, useContext } from "react";
import { MonoSynth } from "../audio/synth";
import { ReactAudioContext, SocketContext } from "../app";
import "./synth.css";
import { BeatState } from "../redux/store";
import { connect } from "react-redux";

export interface MonoSynthArpProps {
  synth: MonoSynth;
  holdNotes: React.MutableRefObject<number[]>;
  hold: boolean;
  setHold: React.Dispatch<React.SetStateAction<boolean>>;
  beat: number;
  socketID: string;
}

interface TouchProps {
  [identifier: number]: number;
}

const MonoSynthArp: React.FC<MonoSynthArpProps> = ({
  synth,
  holdNotes,
  hold,
  setHold,
  beat,
  socketID,
}) => {
  const socket = useContext(SocketContext);
  const { context, setContext } = useContext(ReactAudioContext);
  const touches: React.MutableRefObject<TouchProps> = useRef({});
  const prevIndex: React.MutableRefObject<TouchProps> = useRef({});
  const curIndex: React.MutableRefObject<TouchProps> = useRef({});
  const mouseDown: React.MutableRefObject<boolean> = useRef(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const loc = e.changedTouches[0];
    const location = document.elementFromPoint(
      loc.clientX,
      loc.clientY
    ) as HTMLDivElement;
    const index = Number(location.dataset.index);
    if (index >= 0) {
      if (!hold) {
        touches.current[loc.identifier] = index;
        synth.arpNotes = Object.values(touches.current);
        socket.emit("arpNotes", socketID, synth.arpNotes);
      } else {
        curIndex.current[loc.identifier] = index;
        if (!holdNotes.current.includes(index)) {
          holdNotes.current.push(index);
        } else {
          holdNotes.current = holdNotes.current.filter((t) => t !== index);
        }
        synth.arpNotes = holdNotes.current;
        socket.emit("arpNotes", socketID, synth.arpNotes);
      }
    }
    // error handling for stuck notes
    // if finger triggers device-level events,
    // app touch events won't fire as normal.
    // touching synth again will overwrite touches array
    if (!hold && Object.keys(touches.current).length > e.touches.length) {
      touches.current = {};
      for (let i = 0; i < e.touches.length; i++) {
        const loc = e.touches[i];
        const location = document.elementFromPoint(
          loc.clientX,
          loc.clientY
        ) as HTMLDivElement;
        const index = Number(location.dataset.index);
        if (index >= 0) {
          touches.current[loc.identifier] = index;
        }
      }
    }

    if (!context.isPlaying) {
      synth.playNote(
        synth.scale[index] * synth.octave,
        context.context.currentTime,
        context.tempo
      );
      setContext({ ...context });
    }
  };
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const loc = e.changedTouches[0];
    if (!hold) {
      delete touches.current[loc.identifier];
      synth.arpNotes = Object.values(touches.current);
      socket.emit("arpNotes", socketID, synth.arpNotes);
    } else {
      delete prevIndex.current[loc.identifier];
      delete curIndex.current[loc.identifier];
    }
    if (!context.isPlaying) {
      setContext({ ...context });
    }
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const loc = e.changedTouches[0];
    const location = document.elementFromPoint(
      loc.clientX,
      loc.clientY
    ) as HTMLDivElement;
    let index = Number(location.dataset.index);
    if (index >= 0) {
      if (!hold) {
        touches.current[loc.identifier] = index;
        synth.arpNotes = Object.values(touches.current);
        socket.emit("arpNotes", socketID, synth.arpNotes);
      } else {
        prevIndex.current[loc.identifier] = curIndex.current[loc.identifier];
        curIndex.current[loc.identifier] = index;
        if (
          prevIndex.current[loc.identifier] !==
            curIndex.current[loc.identifier] &&
          !holdNotes.current.includes(index)
        ) {
          holdNotes.current.push(index);
        } else if (
          prevIndex.current[loc.identifier] !==
            curIndex.current[loc.identifier] &&
          holdNotes.current.includes(index)
        ) {
          holdNotes.current = holdNotes.current.filter((t) => t !== index);
        }
        synth.arpNotes = holdNotes.current;
        socket.emit("arpNotes", socketID, synth.arpNotes);
      }
      if (!context.isPlaying) {
        synth.playNote(
          synth.scale[index] * synth.octave,
          context.context.currentTime,
          context.tempo
        );
        setContext({ ...context });
      }
    }
  };

  const handleHoldToggle = () => {
    if (hold) {
      setHold(false);
      synth.arpNotes = [];
      synth.arpIndex = 0;
      socket.emit("arpHoldOff", socketID);
    } else {
      setHold(true);
      synth.arpNotes = [...holdNotes.current];
      socket.emit("arpHoldOn", socketID);
    }
    if (!context.isPlaying) {
      setContext({ ...context });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const index = Number(target.dataset.index);
    mouseDown.current = true;
    if (!hold) {
      synth.arpNotes = [index];
      socket.emit("arpNotes", socketID, synth.arpNotes);
    } else {
      if (holdNotes.current.includes(index)) {
        holdNotes.current = holdNotes.current.filter((i) => i !== index);
      } else {
        holdNotes.current.push(index);
      }
      synth.arpNotes = [...holdNotes.current];
      socket.emit("arpNotes", socketID, synth.arpNotes);
    }
    if (!context.isPlaying) {
      synth.playNote(
        synth.scale[index] * synth.octave,
        context.context.currentTime,
        context.tempo
      );
      setContext({ ...context });
    }
  };
  const handleMouseUp = () => {
    mouseDown.current = false;
    if (!hold) {
      synth.arpNotes = [];
      socket.emit("arpNotes", socketID, synth.arpNotes);
      if (!context.isPlaying) {
        setContext({ ...context });
      }
    }
  };
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseDown.current) return;
    const target = e.target as HTMLDivElement;
    const index = Number(target.dataset.index);
    if (!hold) {
      synth.arpNotes = [index];
      socket.emit("arpNotes", socketID, synth.arpNotes);
    } else {
      if (holdNotes.current.includes(index)) {
        holdNotes.current = holdNotes.current.filter((i) => i !== index);
      } else {
        holdNotes.current.push(index);
      }
      synth.arpNotes = [...holdNotes.current];
      socket.emit("arpNotes", socketID, synth.arpNotes);
    }
    if (!context.isPlaying) {
      synth.playNote(
        synth.scale[index] * synth.octave,
        context.context.currentTime,
        context.tempo
      );
      setContext({ ...context });
    }
  };
  const handleMouseLeave = () => {
    if (mouseDown.current) {
      mouseDown.current = false;
      if (!hold) {
        synth.arpNotes = [];
        socket.emit("arpNotes", socketID, synth.arpNotes);
      }
      if (!context.isPlaying) {
        setContext({ ...context });
      }
    }
  };
  return (
    <div id="arp">
      <div id="arp-container" onMouseLeave={handleMouseLeave}>
        {new Array(9).fill(null).map((_, i) => (
          <div
            className={`arp-square ${i % 5 === 0 ? "root" : ""} ${
              synth.arpNotes.includes(i) ? "selected" : ""
            } ${
              beat >= 0 &&
              synth.isPlaying &&
              !synth.arpNotes.length &&
              synth.pattern[beat][i] === 1
                ? "selected"
                : ""
            }`}
            data-index={i}
            key={i}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
          ></div>
        ))}
      </div>
      <div id="arp-fx">
        <div
          className={`hold-btn ${hold ? "enabled" : ""}`}
          onClick={handleHoldToggle}
        >
          Hold
        </div>
      </div>
    </div>
  );
};

const mapState = (state:BeatState)=> state;

export default connect(mapState, {})(MonoSynthArp);
