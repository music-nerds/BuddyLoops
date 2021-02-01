import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import MonoSynthControls from "./monoSynthControls";
import MonoSynthSquares from "./monoSynthSquares";
import MonoSynthArp from "./monoSynthArp";
import "./synth.css";
import { MonoSynth } from "../audio/synth";
import GridOnIcon from "@material-ui/icons/GridOn";
import MusicNoteIcon from "@material-ui/icons/MusicNote";

interface MonoSynthProps {
  beat: number;
  synth: MonoSynth;
}

const Synth: React.SFC<MonoSynthProps> = ({ beat, synth }) => {
  const [view, setView] = useState("arp");
  const [hold, setHold] = useState(false);
  const holdNotes: React.MutableRefObject<number[]> = useRef([]);

  const {
    location: { pathname },
  } = useHistory();
  const socketID = pathname.slice(1);
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
        />
      )}
    </div>
  );
};

export default Synth;
