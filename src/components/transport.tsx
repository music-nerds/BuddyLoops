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
    console.log(context.context.state)
    socket.on('receivePlay', (target: number) => {
      console.log('received play', target)
      playAtTime(target);
    })
    socket.on('receiveStop', () => {
      console.log('received stop', Date.now())
      stop(context);
    })
  }, [])

  const handlePlay = (): void => {
    // play(context);
    socket.emit('sendPlay', id);
  }

  const handleStop = (): void => {
    socket.emit('sendStop', id)
    // stop(context);
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