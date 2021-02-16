import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import MonoSynthControls from "./monoSynthControls";
import MonoSynthSquares from "./monoSynthSquares";
import MonoSynthArp from "./monoSynthArp";
import "./synth.css";
import { MonoSynth } from "../audio/synth";
import GridOnIcon from "@material-ui/icons/GridOn";
import MusicNoteIcon from "@material-ui/icons/MusicNote";

interface MonoSynthProps {
  synth: MonoSynth;
  hold: boolean;
  setHold: React.Dispatch<React.SetStateAction<boolean>>;
  holdNotes: React.MutableRefObject<number[]>;
}

const Synth: React.SFC<MonoSynthProps> = ({
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
  return (
    <div id="synth-container">
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
          <MonoSynthSquares synth={synth} />
        ) : (
          <MonoSynthArp
            synth={synth}
            holdNotes={holdNotes}
            hold={hold}
            setHold={setHold}
            socketID={socketID}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(Synth);
