import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactAudioContext, SocketContext, DeviceID, TimeObj, Timing } from '../app';
import ContextOverlay from './contextOverlay';
import Transport from './transport';
import StepRow from './stepRow';
// import Indicators from './indicators';
// import { Step } from '@material-ui/core';

interface NewUser {
  id: string;
  timeStamp: number;
}

interface SeqData {
  name: string;
  pattern: (0|1)[];
}
export interface AppState {
  isPlaying: boolean;
  tempo: number;
  swing: number;
  seqData: SeqData[];
}

const Rando: React.FC = () => {
  const {context, setContext} = useContext(ReactAudioContext);
  const [beat, setBeat] = useState(-1);
  const socket = useContext(SocketContext);
  const deviceID = useContext(DeviceID);
  let timeArr = useContext(Timing);
  const {location: {pathname}} = useHistory();
  const socketID = pathname.slice(1);  

  useEffect(() => {
    context.sequencers.forEach(seq => {
      seq.loadSample()
        .then(() => {
          if(seq.errMsg) {
            // TODO: do something with the error
          }
        })
    })
    }, [context.sequencers])
    useEffect(() => {
      // This might get moved later as different instruments may have 
      // different needs, but for now it's ok here.
      context.subscribeSquares(setBeat);
      // sync devices to each other
      socket.emit('handshake', socketID); 
      socket.emit('getOffset', socketID, {
        deviceID,
        deviceSendTime: Date.now(),
        isHost: false
      })
    },[])
  useEffect(() => {
    socket.on('receiveServerTime', (timeObj: TimeObj) => {
      timeObj.deviceReceiveTime = Date.now();
      timeObj.roundTripTime = timeObj.deviceReceiveTime - timeObj.deviceSendTime;
      timeObj.offset = timeObj.deviceReceiveTime - timeObj.serverTime;
      timeArr.push(timeObj);
      console.log("RECEIVE SERVER TIME", timeArr)
      socket.emit('notifyTime', socketID, timeArr[0]);
    })
    socket.on('notifyTime', (timeObj: TimeObj) => {
      const deviceHasThisAlready = timeArr.find(obj => obj.deviceID === timeObj.deviceID);
      if(!deviceHasThisAlready) {
        timeArr.push(timeObj);
      }
      if(timeArr.length > 1) {
        timeArr.sort((a,b) => Number(a.deviceReceiveTime) - Number(b.deviceReceiveTime));
        timeArr[0].isHost = true;
        if(deviceID === timeArr[0].deviceID){
          // I'm the host, send context
          const seqData = context.sequencers.map(seq => {
            return {
              pattern: seq.pattern, 
              name: seq.name
            }
          });
          const { tempo, isPlaying, swing } = context;
          socket.emit('sendState', socketID, {
            seqData,
            tempo,
            isPlaying,
            swing
          });
          console.log("I'm The HOST")
        }
      }
      console.log("NOTIFY TIME",timeArr);
    })
    socket.on('receiveState',(hostContext: AppState) => {
      // setContext(hostContext);
      context.isPlaying = hostContext.isPlaying;
      context.tempo = hostContext.tempo;
      context.swing = hostContext.swing;
      hostContext.seqData.forEach(seq => {
        const sameSeq = context.sequencers.find(ctxSeq => ctxSeq.name === seq.name);
        if(sameSeq){
          sameSeq.pattern = seq.pattern;
        }
      })
      console.log(hostContext.seqData)
      setContext({...context});
      console.log("receiveState", hostContext);
    })
    socket.on('userJoined', (data: NewUser) => {
      console.log("NEW USER", data)
    })
    socket.on('userLeft', (id: string) => {
      console.log("USER LEFT",id)
      const host = timeArr.find(obj => obj.isHost === true);
      if(host?.socketDeviceID === id) {
        // assign new host
        timeArr = timeArr.filter(obj => obj.socketDeviceID !== id);
        timeArr[0].isHost = true;
      } else {
        timeArr = timeArr.filter(obj => obj.socketDeviceID !== id);
      }
      console.log(timeArr)
    })
    // console.log("USEEFFECT", context)
    return () => {
      socket.off('notifyTime');
      socket.off('userLeft');
      socket.off('receiveState');
      socket.off('receiveServerTime');
    }
  }, [timeArr, context])
  
  return (
    <div className='fullPage'>
      <div className="container">
        {
          context.context.state !== "running"  && <ContextOverlay />
        }
        <Transport id={socketID} setBeat={setBeat} />
        {
          context.sequencers.map((seq, idx) => (
            <StepRow row={seq} key={idx} id={socketID} beat={beat} />
            ))
        }
      </div>
    </div>
  )
}

export default Rando;