import React, {useContext} from 'react';
import { v4 as uuidv4 } from 'uuid';
import './landing.css';

const Landing: React.FC = () => {
  return (
    <div className="landing">
      <a href={uuidv4()}>
        <button className="sessionStart">Start Session</button>
      </a>
    </div>
  )
}

export default Landing;