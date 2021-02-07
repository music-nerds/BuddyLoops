import React, { useState, useRef, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../app";
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
  const socket = useContext(SocketContext);
  const [view, setView] = useState("arp");
  const [hold, setHold] = useState(false);
  const holdNotes: React.MutableRefObject<number[]> = useRef([]);

  useEffect(() => {
    socket.on("arpNotes", (notesArr: number[]) => {
      synth.arpNotes = notesArr;
      if (hold) {
        holdNotes.current = [...notesArr];
      }
    });
    socket.on("arpHoldOff", () => {
      setHold(false);
      synth.arpNotes = [];
      synth.arpIndex = 0;
    });
    socket.on("arpHoldOn", () => {
      setHold(true);
      synth.arpNotes = [...holdNotes.current];
    });
    return () => {
      socket.off("arpNotes");
      socket.off("arpHoldOff");
      socket.off("arpHoldOn");
    };
  }, [synth, socket, hold]);

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
          socketID={socketID}
        />
      )}
    </div>
  );
};

export default Synth;
