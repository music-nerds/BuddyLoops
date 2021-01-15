import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Switch from "@material-ui/core/Switch";
import { ReactAudioContext, SocketContext } from "../app";
import PlayArrowSharpIcon from "@material-ui/icons/PlayArrowSharp";
import PauseIcon from "@material-ui/icons/Pause";
import "./sampler.css";

interface Props {
  audition: boolean;
  toggleAudition: () => void;
}

const SoundbankFxPanel: React.FC<Props> = ({ audition, toggleAudition }) => {
  const { context, setContext } = useContext(ReactAudioContext);
  const socket = useContext(SocketContext);
  const {
    location: { pathname },
  } = useHistory();
  const socketID = pathname.slice(1);
  const [playing, setPlaying] = useState(context.sequencersArePlaying);
  const handleDrumLaunch = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    context.toggleSequencersEnabled();
    setPlaying(!playing);
    if (!context.isPlaying) {
      setContext({ ...context });
    }
    socket.emit("sendDrumToggle", socketID);
    console.log("START");
  };

  return (
    <div className="sampler-fx-panel">
      <div>
        <span>Play</span>
        <Switch color="primary" checked={!audition} onChange={toggleAudition} />
        <span>Select</span>
      </div>
      <div
        className="fx-panel-launch"
        onClick={handleDrumLaunch}
        onTouchEnd={handleDrumLaunch}
      >
        {context.sequencersShouldPlayNextLoop ? (
          <PauseIcon fontSize="large" style={{ zIndex: -1 }} />
        ) : (
          <PlayArrowSharpIcon fontSize="large" style={{ zIndex: -1 }} />
        )}
      </div>
    </div>
  );
};

export default SoundbankFxPanel;
