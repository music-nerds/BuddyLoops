import React, { useContext, useRef, useState, useEffect } from "react";
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
  const [preset, setPreset] = useState(synth.name);
  console.log(preset);
  const handlePreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value as string;
    setPreset(name);
    synth.changePreset(name);
    socket.emit("changePreset", socketID, name);
    if (!context.isPlaying) {
      setContext({ ...context });
    }
  };

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
  useEffect(() => {
    socket.on("changePreset", (name: string) => {
      setPreset(name);
    });
  }, [socket, setPreset]);
  return (
    <div id="mono-synth-controls">
      <div className="toggle" ref={toggle}>
        <div className="clear-synth-pattern" onClick={clearPattern}>
          Clear Pattern
        </div>
        <div className="preset-select">
          <select
            name="preset"
            id="preset"
            value={preset}
            onChange={handlePreset}
          >
            <option value="buzzSaw">Buzz Saw</option>
            <option value="deepSine">Deep Sine</option>
          </select>
          <span className="select-arrow"></span>
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
