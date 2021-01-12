import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import { ReactAudioContext, SocketContext } from '../app';
import PlayArrowSharpIcon from '@material-ui/icons/PlayArrowSharp';
import PauseIcon from '@material-ui/icons/Pause';
import './sampler.css';

interface Props {
  currPattern: number;
}

const PatternFxPanel: React.FC<Props> = ({ currPattern }) => {
  const { context } = useContext(ReactAudioContext);
  const {
    location: { pathname },
  } = useHistory();
  const socketID = pathname.slice(1);
  const socket = useContext(SocketContext);
  const sequencer = context.sequencers[currPattern];

  const handlePatternLaunch = () => {
    sequencer.shouldPlayNextLoop = !sequencer.shouldPlayNextLoop;
    socket.emit('sendRowLaunch', socketID, sequencer.name)
  };

  return (
    <div className='pattern-fx-panel'>
      <div 
        className='pattern-fx-launch' 
        onClick={handlePatternLaunch} 
      >
        {
          sequencer.shouldPlayNextLoop
          ? <PauseIcon fontSize='large' />
          : <PlayArrowSharpIcon fontSize='large' />
        }
      </div>
    </div>
  )
}

export default PatternFxPanel;
