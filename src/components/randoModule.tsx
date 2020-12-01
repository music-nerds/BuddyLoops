import React, { useContext, useEffect, createContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactAudioContext, SocketContext } from '../app';
import Transport from './transport';
import Indicators from './indicators';
import StepRow from './stepRow';
import { Step } from '@material-ui/core';


const Rando: React.FC = () => {
  const {context, setContext} = useContext(ReactAudioContext);
  const socket = useContext(SocketContext);
  const {location: {pathname}} = useHistory();  
  useEffect(() => {
    context.sequencers.forEach(seq => {
      seq.loadSample();
    })
  }, [])

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('handshake', pathname.slice(1));
    })
  }, [])

  return (
    <div className='fullPage'>
      <div className="container">
        <Transport id={pathname.slice(1)}/>
        {
          context.sequencers.map((seq, idx) => (
            <StepRow row={seq} key={idx} id={pathname.slice(1)} />
          ))
        }
      </div>
    </div>
  )
}

export default Rando;