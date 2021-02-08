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

interface XYParams {
  x: number;
  y: number;
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
        setContext({ ...context });
      }
    });
    socket.on("receiveRowLaunch", (name: string) => {
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

  useEffect(() => {
    socket.on("clearSynthPattern", () => {
      synth.clearPattern();
      if (!context.isPlaying) {
        setContext({ ...context });
      }
    });
    socket.on("synthPatternChange", (pattern: (0 | 1)[][]) => {
      synth.pattern = pattern;
      if (!context.isPlaying) {
        setContext({ ...context });
      }
    });
    return () => {
      socket.off("clearSynthPattern");
      socket.off("synthPatternChange");
    };
  }, [socket, synth, setContext, context]);
  useEffect(() => {
    socket.on("sendFilter", (params: XYParams) => {
      const freq = Math.pow(10, 2 * params.x + 2); // scales 0 - 1 logarithmically between 100 and 10000
      const q = 12 / (params.y * 11 + 1); // scales 0 - 1 to 1 - 12
      synth.filter.frequency.linearRampToValueAtTime(
        freq,
        synth.context.currentTime + 0.0001
      );
      synth.filter.Q.linearRampToValueAtTime(
        q,
        synth.context.currentTime + 0.0001
      );
    });
    socket.on("sendEnvelope", (params: XYParams) => {
      const time = 0.95 * params.x + 0.05;
      const length = 1 - 0.75 * params.y;
      synth.releaseTime = time;
      synth.noteLength = length;
    });
    socket.on("sendDelay", (params: XYParams) => {
      const feedback = params.x * 0.75; // limit max to .75
      const gain = 1 - params.y; // invert value
      synth.delay.feedback.gain.linearRampToValueAtTime(
        feedback,
        synth.context.currentTime + 0.0001
      );
      synth.delay.output.gain.linearRampToValueAtTime(
        gain,
        synth.context.currentTime + 0.0001
      );
    });
    socket.on("synthLaunch", () => {
      synth.shouldPlayNextLoop = !synth.shouldPlayNextLoop;
    });

    return () => {
      socket.off("setFilter");
      socket.off("setEnvelope");
      socket.off("setDelay");
      socket.off("synthLaunch");
    };
  }, [socket, synth]);
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
