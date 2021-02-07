import React, { useState, useRef, useEffect, useContext } from "react";
import { ReactAudioContext, SocketContext } from "../app";
import Sampler from "./sampler";
import Synth from "./synth";
import { MonoSynth } from "../audio/synth";

export interface InstrumentsProps {
  instrument: string;
  socketID: string;
  beat: number;
  currPattern: number;
  selectPattern: (pattern: number) => void;
  view: string;
  toggleView: (view: string) => void;
  audition: boolean;
  toggleAudition: () => void;
  synth: MonoSynth;
}

interface PatternChange {
  name: string;
  pattern: (0 | 1)[];
  id: string;
}

const Instruments: React.FC<InstrumentsProps> = ({
  instrument,
  socketID,
  beat,
  currPattern,
  selectPattern,
  view,
  toggleView,
  audition,
  toggleAudition,
  synth,
}) => {
  const { context, setContext } = useContext(ReactAudioContext);
  const socket = useContext(SocketContext);
  const [hold, setHold] = useState(false);
  const holdNotes: React.MutableRefObject<number[]> = useRef([]);
  useEffect(() => {
    socket.on("patternChange", (data: PatternChange) => {
      const seq = context.sequencers.find((seq) => seq.name === data.name);
      if (seq) {
        seq.pattern = data.pattern;
      }
      if (!context.isPlaying) {
        // causes bug if isPlaying is true
        // stop button loses reference to context
        setContext({ ...context });
      }
    });

    socket.on("receiveRowLaunch", (name: string) => {
      // if(name === context.sequencers[currPattern].name){
      //   sequencer.shouldPlayNextLoop = !row.shouldPlayNextLoop;
      //   // setLaunchEnabled(row.shouldPlayNextLoop);
      // }
      const sequencer = context.sequencers.find((seq) => seq.name === name)!;
      sequencer.shouldPlayNextLoop = !sequencer.shouldPlayNextLoop;
    });

    socket.on("receiveDrumToggle", () => {
      context.toggleSequencersEnabled();
    });

    socket.on("receiveMomentaryOn", (id: number) => {
      context.setAudition(id);
    });

    socket.on("receiveMomentaryOff", (id: number) => {
      context.endAudition(id);
    });

    return () => {
      socket.off("patternChange");
      socket.off("receiveRowLaunch");
      socket.off("receiveDrumToggle");
      socket.off("sendMomentaryOn");
      socket.off("sendMomentaryOff");
    };
    // }, [context, context.sequencers, row])
  }, [context, context.sequencers, setContext, socket]);

  useEffect(() => {
    socket.on("clearAllSamplerPatterns", () => {
      context.clearAllPatterns();
    });
    socket.on("clearSamplerPattern", (patternIndex: number) => {
      context.sequencers[patternIndex].clearPattern();
    });
    return () => {
      socket.off("clearAllSamplerPatterns");
      socket.off("clearSamplerPattern");
    };
  }, [socket, context]);
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
  }, [synth, socket, hold, holdNotes, setHold]);
  return (
    <div style={{ width: "100%" }}>
      {instrument === "sampler" ? (
        <Sampler
          socketID={socketID}
          beat={beat}
          selectPattern={selectPattern}
          currPattern={currPattern}
          view={view}
          toggleView={toggleView}
          audition={audition}
          toggleAudition={toggleAudition}
        />
      ) : (
        <Synth
          beat={beat}
          synth={synth}
          hold={hold}
          setHold={setHold}
          holdNotes={holdNotes}
        />
      )}
    </div>
  );
};

export default Instruments;
