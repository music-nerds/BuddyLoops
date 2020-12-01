import React, { useContext, useEffect } from 'react';
import PlayArrowSharpIcon from '@material-ui/icons/PlayArrowSharp';
import StopSharpIcon from '@material-ui/icons/StopSharp';
import { ReactAudioContext, SocketContext } from '../app';
import { play, stop } from '../audio/audioFunctions'
import './transport.css';

interface Props {
  id: string;
}

const Transport: React.FC<Props> = (props: Props) => {
  const { context } = useContext(ReactAudioContext);
  const socket = useContext(SocketContext);
  const {id} = props;

  const playAtTime = (target: number) => {
    const now = Date.now();
    const delay = target - now;
    setTimeout(() => {
      play(context)
    }, delay);
  }

  useEffect(() => {
    socket.on('receivePlay', (target: number) => {
      console.log('received', target)
      playAtTime(target);
    })
  }, [])

  const handlePlay = (): void => {
    // play(context);
    socket.emit('sendPlay', id);
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