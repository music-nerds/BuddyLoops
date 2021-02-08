import React, {
  useState,
  useRef,
  useContext,
  useEffect,
  useLayoutEffect,
} from "react";
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

const Synth: React.SFC<MonoSynthProps> = ({ beat, synth }) => {
  const { context, setContext } = useContext(ReactAudioContext);
  const socket = useContext(SocketContext);
  const [view, setView] = useState("arp");
  const [hold, setHold] = useState(false);
  const [width, setWidth] = useState(1);
  const holdNotes: React.MutableRefObject<number[]> = useRef([]);
  const synthDiv = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    socket.on("arpNotes", (notesArr: number[]) => {
      if (!hold) {
        synth.arpNotes = notesArr;
      } else {
        holdNotes.current.concat(notesArr);
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

  const setFilterValues = (x: number, y: number) => {
    synth.filter.frequency.linearRampToValueAtTime(
      Math.pow(10, 2 * x + 2), // scales 0 - 1 logarithmically between 100 and 10000
      synth.context.currentTime + 0.0001
    );
    synth.filter.Q.linearRampToValueAtTime(
      12 / (y * 11 + 1), // scales 0 - 1 to 1 - 12
      synth.context.currentTime + 0.0001
    );
  };
  const setDelayValues = (x: number, y: number) => {
    synth.delay.feedback.gain.linearRampToValueAtTime(
      x * 0.75, // invert value, limit to .75
      synth.context.currentTime + 0.0001
    );
    synth.delay.output.gain.linearRampToValueAtTime(
      1 - y,
      synth.context.currentTime + 0.0001
    );
  };
  const setEnvelopeValues = (x: number, y: number) => {
    synth.releaseTime = x;
    synth.noteLength = 1 - 0.75 * y;
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
          />
          <XY
            setParamValues={setEnvelopeValues}
            initX={width * synth.releaseTime}
            initY={width * synth.noteLength}
          />
          <XY
            setParamValues={setDelayValues}
            initX={width * (1 - synth.delay.output.gain.value)}
            initY={synth.delay.feedback.gain.value * width}
          />
        </div>
      </div>
    </div>
  );
};

export default Synth;
