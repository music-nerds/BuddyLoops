import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactAudioContext } from '../app';
import Transport from './transport';
import Indicators from './indicators';
import StepRow from './stepRow';
import { Step } from '@material-ui/core';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';
// const socket = io(SOCKET_URL);

const Rando: React.FC = () => {
  const {context, setContext} = useContext(ReactAudioContext);
  const { location: { pathname } } = useHistory();

  // const socket = io(SOCKET_URL);

  useEffect(() => {
    context.sequencers.forEach(seq => {
      seq.loadSample(context.context);
    })
    console.log(context)
  }, [])

  // useEffect(() => {
  //   socket.on('connect', () => {
  //     socket.emit('handshake', pathname.slice(1));
  //   })
  // }, [])

  // useEffect(() => {
  //   socket.on('connect', () => {
  //     socket.emit()
  //   })
  // }, [])

  return (
    <div className='fullPage'>
      <div className="container">
        <Transport />
        <Indicators />
        {
          context.sequencers.map((seq, idx) => (
            <StepRow row={seq} key={idx} />
          ))
        }
      </div>
    </div>
  )
}

export default Rando;