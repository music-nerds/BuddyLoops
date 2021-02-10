import React, { useContext, useCallback } from "react";
import { MonoSynth } from "../audio/synth";
import { SocketContext } from "../app";
import XY from "./xy";
import HoldBtn from "./holdBtn";

export interface SynthEFXProps {
  synth: MonoSynth;
  socketID: string;
  hold: boolean;
  handleHoldToggle: () => void;
  width: number;
  holdNotes: React.MutableRefObject<number[]>;
}

const SynthEFX: React.FC<SynthEFXProps> = ({
  synth,
  socketID,
  hold,
  handleHoldToggle,
  width,
  holdNotes,
}) => {
  const socket = useContext(SocketContext);
  const setFilterValues = useCallback(
    (x: number, y: number) => {
      const freq = Math.pow(10, 1.3979400086720375 * x + 2.6020599913279625); // scales 0 - 1 logarithmically between 400 and 10000
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
    },
    [socket, socketID, synth]
  );
  const setDelayValues = useCallback(
    (x: number, y: number) => {
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
    },
    [socket, socketID, synth]
  );
  const setEnvelopeValues = useCallback(
    (x: number, y: number) => {
      const time = 0.95 * x + 0.05;
      const length = 1 - 0.75 * y;
      synth.releaseTime = time;
      synth.noteLength = length;
      socket.emit("setEnvelope", socketID, x, y);
    },
    [socket, socketID, synth]
  );
  return (
    <div className="synth-effects-playground">
      <HoldBtn
        hold={hold}
        handleHoldToggle={handleHoldToggle}
        holdNotes={holdNotes}
      />
      <div className="xy-pads">
        <XY
          setParamValues={setFilterValues}
          initY={(width / 11) * (11 - (synth.filter.Q.value - 1))}
          initX={width * (Math.log10(synth.filter.frequency.value) / 4)} // logarithmically scales value
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
          initY={width * (1 - synth.delay.output.gain.value)}
          initX={synth.delay.feedback.gain.value * width}
          name="Delay"
        />
      </div>
    </div>
  );
};

export default SynthEFX;
