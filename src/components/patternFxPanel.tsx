import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactAudioContext, SocketContext } from '../app';
import PlayArrowSharpIcon from '@material-ui/icons/PlayArrowSharp';
import PauseIcon from '@material-ui/icons/Pause';
import './sampler.css';

interface Props {
  currPattern: number;
}

const PatternFxPanel: React.FC<Props> = ({ currPattern }) => {
  const { context, setContext } = useContext(ReactAudioContext);
  const {
    location: { pathname },
  } = useHistory();
  const socketID = pathname.slice(1);
  const socket = useContext(SocketContext);
  const sequencer = context.sequencers[currPattern];
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

  const clearRow = () => {
    context.sequencers[currPattern].clearPattern();
  }

  return (
    <div className='pattern-fx-panel'>
      <div onClick={clearRow} className='fx-panel-launch' id='clear-button'>
        <span>CLEAR PATTERN</span>
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
  )
}

export default PatternFxPanel;
