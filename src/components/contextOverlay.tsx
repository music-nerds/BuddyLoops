import React, { useContext, useEffect } from 'react';
import { ReactAudioContext } from '../app';
import Button from '@material-ui/core/Button';
import './contextOverlay.css';

const ContextOverlay: React.SFC = () => {
  const { context, setContext } = useContext(ReactAudioContext);
  console.log(context.context.state)

  const handleStart = () => {
    if(context.context.state !== 'running'){
      context.context.resume()
        .then(() => {
          setContext({...context})
        })
    } else {
      // because firefox - triggers rerender to remove overlay
      setContext({...context})
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