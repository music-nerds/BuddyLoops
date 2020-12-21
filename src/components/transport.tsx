import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Slider from '@material-ui/core/Slider';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import PlayArrowSharpIcon from '@material-ui/icons/PlayArrowSharp';
import StopSharpIcon from '@material-ui/icons/StopSharp';
import GroupIcon from '@material-ui/icons/Group';
import { ReactAudioContext, SocketContext, Timing, DeviceID } from '../app';
import { AppState } from './randoModule';
import { play, stop } from '../audio/audioFunctions'
import Button from '@material-ui/core/Button';
import './transport.css';

const Alert: React.FC<AlertProps> = (props: AlertProps) => <MuiAlert elevation={6} variant='filled' {...props} />

interface Props {
  id: string;
  setBeat: React.Dispatch<React.SetStateAction<number>>;
}

const Transport: React.FC<Props> = ({id, setBeat}) => {
  const [open, setOpen] = useState(false);
  const { context } = useContext(ReactAudioContext);
  const [tempo, setTempo] = useState<number>(context.tempo);
  const [swing, setSwing] = useState<number>(0);
  const {location: {pathname}} = useHistory();
  const socketID = pathname.slice(1);  
  const socket = useContext(SocketContext);
  const timeArr = useContext(Timing);
  const deviceID = useContext(DeviceID);

  useEffect(() => {
    let timeoutID: NodeJS.Timeout;
    const playAtTime = (target: number) => {
      const myTimeObj = timeArr.find(obj => obj.deviceID === deviceID);
      const offset = myTimeObj?.offset || 0;
      const now = Date.now();
      const delay = target + offset - now;
      timeoutID = setTimeout(() => {
        play(context)
      }, delay);
    }
    socket.on('receivePlay', (target: number) => {
      console.log('received play', target)
      playAtTime(target);
    })
    socket.on('receiveStop', () => {
      console.log('received stop', Date.now())
      stop(context);
      setBeat(-1);
    })
    socket.on('receiveState', (hostState: AppState) => {
      setSwing(hostState.swing);
      setTempo(hostState.tempo);
      console.log('TRANSPORT RECEIVE STATE', hostState)
    })
    return () => {
      socket.off('receivePlay');
      socket.off('receiveStop');
      clearTimeout(timeoutID);
    }
  }, [timeArr, context, socket, deviceID, setBeat])

  const handlePlay = (): void => {
    socket.emit('sendPlay', id, timeArr);
  }

  const handleStop = (): void => {
    setBeat(-1);
    socket.emit('sendStop', id)
  }

  const clipboard = async (): Promise<void> => {
    const url:string = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setOpen(true);
    } catch (err) {
      console.error('failed to copy', err);
    }
  }

  const close = (event?: React.SyntheticEvent, reason?: string): void => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  // const tempoUp = (): void => {
  //   const newTempo: number = context.tempo+1
  //   context.updateTempo(newTempo)
  //   setTempo(newTempo)
  //   socket.emit('tempoChange', socketID, newTempo);
  // }

  // const tempoDown = (): void => {
  //   const newTempo: number = context.tempo-1;
  //   context.updateTempo(newTempo)
  //   setTempo(newTempo);
  //   socket.emit('tempoChange', socketID, newTempo);
  // }

  const updateTempo = (event: any, newValue: number | number[]) => {
    context.updateTempo(newValue as number);
    setTempo(newValue as number);
    socket.emit('tempoChange', socketID, newValue);
  }

  const updateSwing = (event: any, newValue: number | number[]) => {
    setSwing(newValue as number);
    context.updateSwing(newValue as number);
    socket.emit('swingChange', socketID, newValue as number);
  };

  useEffect(() => {
    socket.on('swingChange', (value: number) => {
      console.log("SWING CHANGE")
      setSwing(value);
      context.updateSwing(value);
    })
    socket.on('tempoChange', (value: number) => {
      console.log("TEMPO CHANGE")
      setTempo(value);
      context.updateTempo(value);
    })
    return () => {
      socket.off('swingChange');
      socket.off('tempoChange');
    }
  },[context, socket])

  return (
    <div id='transport'>
      <div className='transport-bottom-row'>
        <div className='tempo-adjust'>
          <span>{tempo} bpm</span>
          <Slider value={tempo} onChange={updateTempo} color='secondary' min={50} max={280}/>
        </div>
        <div className='swing-adjust'>
          <span>Swing {swing}%</span>
          <Slider value={swing} onChange={updateSwing} color='secondary' />
        </div>
      </div>
      <div className='transport-top-row'>
        <Button 
          color='secondary'
          onClick={handlePlay}
        >
          <PlayArrowSharpIcon style={{ fontSize: 64 }} />
        </Button>
        <Button 
          color='secondary'
          onClick={handleStop}
        >
          <StopSharpIcon style={{ fontSize: 64 }} />
        </Button>
        <Button
          startIcon={<GroupIcon fontSize='large' />}
          className='share-btn'
          color='primary'
          variant='contained'
          size='small'
          style={{ height: 24, verticalAlign: 'center', padding: '0 8px' }}
          onClick={clipboard}
        >
          Share
        </Button>
      </div>
      <Snackbar open={open} autoHideDuration={5000} onClose={close}>
        <Alert onClose={close} severity='success'>
          Link copied to clipboard, send to a friend!
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Transport;
