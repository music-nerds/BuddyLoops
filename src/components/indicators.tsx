import React, { useContext, useState, useEffect } from 'react';
import { ReactAudioContext } from '../app';
import './indicators.css';

const Indicators: React.FC = () => {
  const { context } = useContext(ReactAudioContext);
  const [beat, setBeat] = useState(0);
  useEffect(() => {
    context.subscribeSquares(setBeat);
  }, [context, setBeat])
  return (
    <div id="indicators">
      {
        new Array(16).fill(null).map((e, idx) => {
          return (
            <div key={idx} className={`indicator ${beat === idx && 'active-indicator'}`}></div>
          )
        })
      }
    </div>
  )
}

export default Indicators;