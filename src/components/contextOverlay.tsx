import React, { useContext, useEffect } from 'react';
import { ReactAudioContext, Timing, DeviceID } from '../app';
import { play, calculateFullCycleTime } from '../audio/audioFunctions'

import Button from '@material-ui/core/Button';
import './contextOverlay.css';

interface Props {
  setReady: React.Dispatch<React.SetStateAction<boolean>>;
}
const ContextOverlay: React.SFC<Props> = ({setReady}) => {
  const { context } = useContext(ReactAudioContext);
  const timeArr = useContext(Timing);
  const deviceID = useContext(DeviceID);
  useEffect(() => {
    // prevents uneccessary renders if browser allows audiocontext to start
    // on refresh as this component is conditionally rendered according to ready
    if(context.context.state === 'running') {
      setReady(true);
    }
  }, [context.context.state, setReady])
  const handleStart = () => {
    if(context.context.state !== 'running'){
      setReady(true);
      context.context.resume()
        .then(() => {
          if(context.nextCycleTime){
            const myTimeObj = timeArr.find(obj => obj.deviceID === deviceID);
            const offset = myTimeObj?.offset || 0;
            const now = Date.now();
            let delay = context.nextCycleTime + offset - now;
            while(delay < 0){
              delay = delay + calculateFullCycleTime(context);
            }
            setTimeout(() => {
              play(context)
            }, delay);
          }
        })
    } else {
      setReady(true);
    }
  }

  return ( 
    <div className={context.context.state === 'running' ? 'no-overlay' : 'context-overlay'}>
      <Button 
        variant="outlined"
        onClick={handleStart}
      >
        Get Started
      </Button>
    </div>
   );
}
 
export default ContextOverlay;