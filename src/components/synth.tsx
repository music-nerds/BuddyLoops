import React from "react";
import { useHistory } from "react-router-dom";
import MonoSynthControls from "./monoSynthControls";
import MonoSynthSquares from "./monoSynthSquares";
import "./synth.css";
import { MonoSynth } from "../audio/synth";

interface MonoSynthProps {
  beat: number;
  synth: MonoSynth;
}

const Synth: React.SFC<MonoSynthProps> = ({ beat, synth }) => {
  const {
    location: { pathname },
  } = useHistory();
  const socketID = pathname.slice(1);
  return (
    <div id="synth">
      <MonoSynthControls synth={synth} socketID={socketID} />
      <MonoSynthSquares synth={synth} beat={beat} />
    </div>
  );
};

export default Synth;
