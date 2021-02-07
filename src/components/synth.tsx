import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
  const [view, setView] = useState("arp");

  const {
    location: { pathname },
  } = useHistory();
  const socketID = pathname.slice(1);

  const setFilterValues = (x: number, y: number) => {
    synth.filter.frequency.linearRampToValueAtTime(
      Math.pow(10, 2 * y + 2), // scales 0 - 1 logarithmically between 100 and 10000
      synth.context.currentTime + 0.0001
    );
    synth.filter.Q.linearRampToValueAtTime(
      12 / (x * 11 + 1),
      synth.context.currentTime + 0.0001
    );
  };
  const setDelayValues = (x: number, y: number) => {
    synth.delay.feedback.gain.linearRampToValueAtTime(
      y * 0.75, // 1 is too much
      synth.context.currentTime + 0.0001
    );
    synth.delay.output.gain.linearRampToValueAtTime(
      1 - x, // invert value
      synth.context.currentTime + 0.0001
    );
  };
  return (
    <div id="synth">
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
        <XY
          setParamValues={setFilterValues}
          initX={(128 / 11) * (11 - (synth.filter.Q.value - 1))}
          initY={128 * (synth.filter.frequency.value / 10000)}
        />
        <XY
          setParamValues={setDelayValues}
          initX={128 * (1 - synth.delay.output.gain.value)}
          initY={synth.delay.feedback.gain.value * 128}
        />
      </div>
    </div>
  );
};

export default Synth;
