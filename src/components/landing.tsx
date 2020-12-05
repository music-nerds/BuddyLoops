import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import { ReactAudioContext } from '../app';
import { v4 as uuidv4 } from 'uuid';
import './landing.css';

const Landing: React.FC = () => {
  const { context, setContext } = useContext(ReactAudioContext);

  const handleStart = () => {
    if(context.context.state !== 'running'){
      context.context.resume()
        .then(() => {
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