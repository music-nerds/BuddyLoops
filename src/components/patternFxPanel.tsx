import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { ReactAudioContext, SocketContext } from "../app";
import PlayArrowSharpIcon from "@material-ui/icons/PlayArrowSharp";
import PauseIcon from "@material-ui/icons/Pause";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import "./sampler.css";

interface Props {
  currPattern: number;
  selectPattern: (pattern: number) => void;
}

const PatternFxPanel: React.FC<Props> = ({ currPattern, selectPattern }) => {
  const { context, setContext } = useContext(ReactAudioContext);
  const {
    location: { pathname },
  } = useHistory();
  const socketID = pathname.slice(1);
  const socket = useContext(SocketContext);
  const [playing, setPlaying] = useState(context.sequencersArePlaying);

  // const handlePatternLaunch = () => {
  //   sequencer.shouldPlayNextLoop = !sequencer.shouldPlayNextLoop;
  //   socket.emit('sendRowLaunch', socketID, sequencer.name)
  // };

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

  const clearRow = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    context.sequencers[currPattern].clearPattern();
    socket.emit("clearSamplerPattern", socketID, currPattern);
  };

  const downButton = () => {
    currPattern === 15
    ? selectPattern(0)
    : selectPattern((currPattern+1));
  }

  const upButton = () => {
    currPattern === 0
    ? selectPattern(15)
    : selectPattern((currPattern -1));
  }

  return (
    <div className="pattern-fx-panel">
      <div className="pattern-fx-left">
        <div
          onClick={clearRow}
          onTouchEnd={clearRow}
          className="fx-panel-launch"
          id="clear-button"
        >
          <span>CLEAR TRACK</span>
        </div>
        <div className="pattern-fx-name">
          <span>
            {
              (currPattern+1 <= 9)
              ? '0'
              : null
            }
            {currPattern+1}
            {'.'}
            {context.sequencers[currPattern].name}
          </span>
        </div>
        <div className='fx-panel-pattern-selector'>
          <ArrowDropUpIcon onClick={upButton} />
          <ArrowDropDownIcon onClick={downButton} />
        </div>
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
      {/* <div 
        className='pattern-fx-launch' 
        onClick={handlePatternLaunch} 
      >
        {
          sequencer.shouldPlayNextLoop
          ? <PauseIcon fontSize='large' />
          : <PlayArrowSharpIcon fontSize='large' />
        }
      </div> */}
    </div>
  );
};

export default PatternFxPanel;
