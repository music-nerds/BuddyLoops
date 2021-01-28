import React, { useRef, useState, useContext } from "react";
import { MonoSynth } from "../audio/synth";
import { ReactAudioContext } from "../app";
import "./synth.css";

export interface MonoSynthArpProps {
  synth: MonoSynth;
}

interface TouchProps {
  index: number;
  identifier: number;
}

const MonoSynthArp: React.FC<MonoSynthArpProps> = ({ synth }) => {
  // const socket = useContext(SocketContext);
  const { context, setContext } = useContext(ReactAudioContext);
  const [hold, setHold] = useState(false);
  const touches: React.MutableRefObject<TouchProps[]> = useRef([]);
  const holdNotes: React.MutableRefObject<TouchProps[]> = useRef([]);
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
        touches.current.push({
          identifier: loc.identifier,
          index,
        });
      } else {
        if (!touches.current.some((t) => t.index === index)) {
          touches.current.push({
            identifier: loc.identifier,
            index,
          });
        } else {
          touches.current = touches.current.filter((t) => t.index !== index);
        }
        holdNotes.current = [...touches.current];
      }
    }
    // error handling for stuck notes
    // if finger triggers device-level events,
    // app touch events won't fire as normal.
    // touching synth again will overwrite touches array
    if (!hold && touches.current.length > e.touches.length) {
      touches.current = [];
      for (let i = 0; i < e.touches.length; i++) {
        const loc = e.touches[i];
        const location = document.elementFromPoint(
          loc.clientX,
          loc.clientY
        ) as HTMLDivElement;
        const index = Number(location.dataset.index);
        if (index >= 0) {
          touches.current.push({
            identifier: loc.identifier,
            index,
          });
        }
      }
    }
    synth.arpNotes = touches.current.map((t) => t.index);
    if (!context.isPlaying) {
      setContext({ ...context });
    }
  };
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const loc = e.changedTouches[0];
    if (!hold) {
      touches.current = touches.current.filter(
        (t) => t.identifier !== loc.identifier
      );
      synth.arpNotes = touches.current.map((t) => t.index);
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
        const thisTouch = touches.current.find(
          (t) => t.identifier === loc.identifier
        )!;
        thisTouch.index = index;
      } else {
        holdNotes.current = [...touches.current];
      }
      synth.arpNotes = touches.current.map((t) => t.index);
      if (!context.isPlaying) {
        setContext({ ...context });
      }
    }
  };

  const handleHoldToggle = () => {
    if (hold) {
      setHold(false);
      synth.arpNotes = [];
      synth.arpIndex = 0;
    } else {
      setHold(true);
      synth.arpNotes = holdNotes.current.map((t) => t.index);
    }
  };
  return (
    <div id="arp">
      <div id="arp-container">
        {new Array(9).fill(null).map((_, i) => (
          <div
            className={`arp-square ${i % 5 === 0 ? "root" : ""} ${
              synth.arpNotes.includes(i) ? "selected" : ""
            }`}
            data-index={i}
            key={i}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
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

export default MonoSynthArp;
