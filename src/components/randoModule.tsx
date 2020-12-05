import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactAudioContext, SocketContext, DeviceID, TimeObj, Timing } from '../app';
import ContextOverlay from './contextOverlay';
import Transport from './transport';
import StepRow from './stepRow';
// import Indicators from './indicators';
// import { Step } from '@material-ui/core';

const Rando: React.FC = () => {
  const {context, setContext} = useContext(ReactAudioContext);
  const [beat, setBeat] = useState(-1);
  const socket = useContext(SocketContext);
  const deviceID = useContext(DeviceID);
  const timeArr = useContext(Timing);
  const {location: {pathname}} = useHistory();
  const socketID = pathname.slice(1);  

  useEffect(() => {
      context.sequencers.forEach(seq => {
        seq.loadSample();
      })
      socket.emit('handshake', socketID); 
      socket.emit('getOffset', socketID, {
        deviceID,
        deviceSendTime: Date.now()
      })
      socket.on('receiveServerTime', (timeObj: TimeObj) => {
        timeObj.deviceReceiveTime = Date.now();
        timeObj.roundTripTime = timeObj.deviceReceiveTime - timeObj.deviceSendTime;
        timeObj.offset = timeObj.deviceReceiveTime - timeObj.serverTime;
        timeArr.push(timeObj);
        // console.log(timeObj);
          socket.emit('notifyTime', socketID, timeArr[0]);
      })
      socket.on('notifyTime', (timeObj: TimeObj) => {
        const deviceHasThisAlready = timeArr.find(obj => obj.deviceID === timeObj.deviceID);
        if(!deviceHasThisAlready) {
          timeArr.push(timeObj);
        }
      })
      context.subscribeSquares(setBeat);
  }, [])
  
  return (
    <div className='fullPage'>
      <div className="container">
        {
          context.context.state !== "running"  && <ContextOverlay />
        }
        <Transport id={pathname.slice(1)} setBeat={setBeat} />
        {
          context.sequencers.map((seq, idx) => (
            <StepRow row={seq} key={idx} id={pathname.slice(1)} beat={beat} />
            ))
        }
      </div>
    </div>
  )
}

export default Rando;