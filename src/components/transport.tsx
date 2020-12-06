import React, { useContext, useEffect, useState } from 'react';
import Slider from '@material-ui/core/Slider';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import PlayArrowSharpIcon from '@material-ui/icons/PlayArrowSharp';
import StopSharpIcon from '@material-ui/icons/StopSharp';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import GroupIcon from '@material-ui/icons/Group';
import { ReactAudioContext, SocketContext, Timing } from '../app';
import { StepContext } from '../audio/createContext';
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
  const { context, setContext } = useContext(ReactAudioContext);
  const [tempo, setTempo] = useState<number>(context.tempo);
  const [swing, setSwing] = useState<number>(0);
  const socket = useContext(SocketContext);
  const timeArr = useContext(Timing);
  const playAtTime = (target: number) => {
    const offset = timeArr[0].offset || 0;
    const now = Date.now();
    const delay = target + offset - now;
    setTimeout(() => {
      play(context)
      console.log("PLAY AT TIME",Date.now())
    }, delay);
  }
  useEffect(() => {
    socket.on('receivePlay', (target: number) => {
      console.log('received play', target)
      playAtTime(target);
    })
    socket.on('receiveStop', () => {
      console.log('received stop', Date.now())
      stop(context);
      setBeat(-1);
    })
    return () => {
      socket.off('receivePlay');
      socket.off('receiveStop');
    }
  }, [context])

  const handlePlay = (): void => {
    if(context.context.state !== 'running'){
      context.context.resume();
    }
    // play(context)
    socket.emit('sendPlay', id, timeArr);
  }

  const handleStop = (): void => {
    if(context.context.state !== 'running'){
      context.context.resume();
    }
    setBeat(-1);
    socket.emit('sendStop', id)
    // stop(context);
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

  const tempoUp = (): void => {
    const newTempo: number = context.tempo+1
    context.updateTempo(newTempo)
    setTempo(newTempo)
  }

  const tempoDown = (): void => {
    const newTempo: number = context.tempo-1;
    context.updateTempo(newTempo)
    setTempo(newTempo);
  }

  const updateSwing = (event: any, newValue: number | number[]) => {
    // console.log('UPDATE SWING',newValue)
    setSwing(newValue as number);
    context.updateSwing(newValue as number);
    setContext({...context})
  };

  return (
    <div id='transport'>
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
      <div className='tempo-container'>
        <div className='tempo-adjust'>
          <Button onClick={tempoDown}>
            <RemoveIcon color='secondary' />
          </Button>
          <label style={{ color: 'var(--text)'}}>
            <input className='tempo-input' type='number' value={tempo} readOnly></input>
            bpm
          </label>
          <Button onClick={tempoUp}>
            <AddIcon color='secondary' />
          </Button>
        </div>
        <div className='swing-adjust'>
          <label style={{ color: 'var(--text)' }}>
            <Slider value={swing} onChange={updateSwing} color='secondary' />
            Swing
          </label>
        </div>
      </div>
      <Button
        startIcon={<GroupIcon fontSize='large' />}
        className='share-btn'
        color='secondary'
        variant='contained'
        size='small'
        style={{ height: 50, verticalAlign: 'center' }}
        onClick={clipboard}
      >
        Jam with a friend
      </Button>
      <Snackbar open={open} autoHideDuration={5000} onClose={close}>
        <Alert onClose={close} severity='success'>
          Link copied to clipboard, send to a friend!
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Transport;
