import React, { useContext } from 'react';
import PlayArrowSharpIcon from '@material-ui/icons/PlayArrowSharp';
import StopSharpIcon from '@material-ui/icons/StopSharp';
import { ReactAudioContext } from '../app';
import { play, stop } from '../audio/audioFunctions'
import './transport.css';

const Transport: React.FC = () => {
  const { context } = useContext(ReactAudioContext);
  const handlePlay = (): void => {
    play(context);
  }
  const handleStop = (): void => {
    stop(context);
  }
  return (
    <div id='transport'>
      <button 
        className='transport-btn'
        onClick={handlePlay}
      >
        <PlayArrowSharpIcon style={{ fontSize: 64 }} />
      </button>
      <button 
        className='transport-btn'
        onClick={handleStop}
      >
        <StopSharpIcon style={{ fontSize: 64 }} />
      </button>
    </div>
  )
}

export default Transport;