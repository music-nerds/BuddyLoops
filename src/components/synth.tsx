import React, { useContext } from "react";
import { ReactAudioContext } from "../app";
import { useHistory } from "react-router-dom";
import MonoSynthControls from "./monoSynthControls";
import MonoSynthSquares from "./monoSynthSquares";
import "./synth.css";

interface MonoSynthProps {
  beat: number;
}

const MonoSynth: React.SFC<MonoSynthProps> = ({ beat }) => {
  const { context } = useContext(ReactAudioContext);
  const { synth } = context;
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

export default MonoSynth;
