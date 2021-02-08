import React, { useState, useRef, useContext, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { SocketContext, ReactAudioContext } from "../app";
import MonoSynthControls from "./monoSynthControls";
import MonoSynthSquares from "./monoSynthSquares";
import MonoSynthArp from "./monoSynthArp";
import XY from "./xy";
import "./synth.css";
import { MonoSynth } from "../audio/synth";
import GridOnIcon from "@material-ui/icons/GridOn";
import MusicNoteIcon from "@material-ui/icons/MusicNote";

interface MonoSynthProps {
  beat: number;
  synth: MonoSynth;
  hold: boolean;
  setHold: React.Dispatch<React.SetStateAction<boolean>>;
  holdNotes: React.MutableRefObject<number[]>;
}

const Synth: React.SFC<MonoSynthProps> = ({
  beat,
  synth,
  hold,
  setHold,
  holdNotes,
}) => {
  const { context, setContext } = useContext(ReactAudioContext);
  const socket = useContext(SocketContext);
  const [view, setView] = useState("arp");
  const [width, setWidth] = useState(1);
  const synthDiv = useRef<HTMLDivElement | null>(null);
  const {
    location: { pathname },
  } = useHistory();
  const socketID = pathname.slice(1);

  useLayoutEffect(() => {
    if (synthDiv.current) {
      const divSize = synthDiv.current.getBoundingClientRect();
      if (divSize.width <= 375) {
        setWidth(96);
      } else {
        setWidth(128);
      }
    }
  }, []);

  const setFilterValues = (x: number, y: number) => {
    const freq = Math.pow(10, 2 * x + 2); // scales 0 - 1 logarithmically between 100 and 10000
    const q = 12 / (y * 11 + 1); // scales 0 - 1 to 1 - 12
    synth.filter.frequency.linearRampToValueAtTime(
      freq,
      synth.context.currentTime + 0.0001
    );
    synth.filter.Q.linearRampToValueAtTime(
      q,
      synth.context.currentTime + 0.0001
    );
    socket.emit("setFilter", socketID, x, y);
  };
  const setDelayValues = (x: number, y: number) => {
    const feedback = x * 0.75; // limit max to .75
    const gain = 1 - y; // invert value
    synth.delay.feedback.gain.linearRampToValueAtTime(
      feedback,
      synth.context.currentTime + 0.0001
    );
    synth.delay.output.gain.linearRampToValueAtTime(
      gain,
      synth.context.currentTime + 0.0001
    );
    socket.emit("setDelay", socketID, x, y);
  };
  const setEnvelopeValues = (x: number, y: number) => {
    const time = 0.95 * x + 0.05;
    const length = 1 - 0.75 * y;
    synth.releaseTime = time;
    synth.noteLength = length;
    socket.emit("setEnvelope", socketID, x, y);
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
  return (
    <div id="synth" ref={synthDiv}>
      <div className="synth-tabs">
        <div
          className={`synth-pattern-tab ${view === "arp" ? "selected" : ""}`}
          onClick={() => setView("arp")}
        >
          <MusicNoteIcon
            style={{ color: `${view === "arp" ? "white" : "#aaa"}` }}
          />
        </div>
        <div
          className={`synth-pattern-tab ${
            view === "pattern" ? "selected" : ""
          }`}
          onClick={() => setView("pattern")}
        >
          <GridOnIcon
            style={{
              color: `${view === "pattern" ? "white" : "#aaa"}`,
            }}
          />
        </div>
      </div>
      <MonoSynthControls synth={synth} socketID={socketID} />
      {view === "pattern" ? (
        <MonoSynthSquares synth={synth} beat={beat} />
      ) : (
        <MonoSynthArp
          synth={synth}
          holdNotes={holdNotes}
          hold={hold}
          setHold={setHold}
          beat={beat}
          socketID={socketID}
        />
      )}
      <div className="synth-effects-playground">
        <div className="hold">
          <div
            className={`hold-btn ${hold ? "enabled" : ""}`}
            onClick={handleHoldToggle}
          >
            HOLD
          </div>
        </div>
        <div className="xy-pads">
          <XY
            setParamValues={setFilterValues}
            initX={(width / 11) * (11 - (synth.filter.Q.value - 1))}
            initY={width * (synth.filter.frequency.value / 10000)}
            name="Filter"
          />
          <XY
            setParamValues={setEnvelopeValues}
            initX={width * synth.releaseTime}
            initY={width * synth.noteLength}
            name="Envelope"
          />
          <XY
            setParamValues={setDelayValues}
            initX={width * (1 - synth.delay.output.gain.value)}
            initY={synth.delay.feedback.gain.value * width}
            name="Delay"
          />
        </div>
      </div>
    </div>
  );
};

export default Synth;
