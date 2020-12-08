import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import { ReactAudioContext, DeviceID } from '../app';
import { v4 as uuidv4 } from 'uuid';
import './landing.css';

const Landing: React.FC = () => {
  const { context, setContext } = useContext(ReactAudioContext);
  const deviceID = useContext(DeviceID);
  const handleStart = () => {
    // if you're hitting this button, you're the host
    context.hostID = deviceID;
    if(context.context.state !== 'running'){
      context.context.resume()
        .then(() => {
          // triggers re-render to avoid context overlay
          setContext({...context})
        })
    }
  }

  return (
    <div className="landing">
      <Link to={uuidv4()}>
        <Button 
          id="sessionStart"
          variant="outlined"
          onClick={handleStart}
        >
          Get Started
        </Button>
      </Link>
    </div>
  )
}

export default Landing;