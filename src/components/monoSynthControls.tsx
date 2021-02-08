import React, { useContext, useRef } from "react";
import { MonoSynth } from "../audio/synth";
import { ReactAudioContext } from "../app";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import { SocketContext } from "../app";

export interface MonoSynthControlsProps {
  synth: MonoSynth;
  socketID: string;
}

const MonoSynthControls: React.SFC<MonoSynthControlsProps> = ({
  synth,
  socketID,
}) => {
  const toggle: React.RefObject<HTMLDivElement> | null = useRef(null);
  const { context, setContext } = useContext(ReactAudioContext);
  const socket = useContext(SocketContext);

  const handleLaunch = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    synth.shouldPlayNextLoop = !synth.shouldPlayNextLoop;
    socket.emit("synthLaunch", socketID);
  };
  const clearPattern = () => {
    synth.clearPattern();
    socket.emit("clearSynthPattern", socketID);
    if (!context.isPlaying) {
      setContext({ ...context });
    }
  };
  return (
    <div id="mono-synth-controls">
      <div className="toggle" ref={toggle}>
        <div className="clear-synth-pattern" onClick={clearPattern}>
          Clear Pattern
        </div>
        <div className="synth-launch" onClick={handleLaunch}>
          {synth.shouldPlayNextLoop ? (
            <PauseIcon style={{ color: "white" }} fontSize="large" />
          ) : (
            <PlayArrowIcon style={{ color: "white" }} fontSize="large" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MonoSynthControls;
