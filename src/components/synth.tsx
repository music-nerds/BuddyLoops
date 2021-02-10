import React, {
  useState,
  useRef,
  useContext,
  useLayoutEffect,
  useCallback,
} from "react";
import { useHistory } from "react-router-dom";
import { SocketContext, ReactAudioContext } from "../app";
import { MonoSynth } from "../audio/synth";
import MonoSynthControls from "./monoSynthControls";
import MonoSynthSquares from "./monoSynthSquares";
import MonoSynthArp from "./monoSynthArp";
import SynthEFX from "./synthEFX";
import SynthTabs from "./synthTabs";
import "./synth.css";

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

  const handleHoldToggle = useCallback(() => {
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
  }, [context, hold, setHold, synth, socket, socketID, holdNotes, setContext]);
  return (
    <div id="synth" ref={synthDiv}>
      <SynthTabs view={view} setView={setView} />
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
      <SynthEFX
        hold={hold}
        handleHoldToggle={handleHoldToggle}
        holdNotes={holdNotes}
        width={width}
        socketID={socketID}
        synth={synth}
      />
    </div>
  );
};

export default Synth;
