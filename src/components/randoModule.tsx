import React, { useContext, useEffect } from 'react';
import { ReactAudioContext } from '../app';
import Transport from './transport';
import Indicators from './indicators';
import StepRow from './stepRow';
import { Step } from '@material-ui/core';

const Rando: React.FC = () => {
  const {context, setContext} = useContext(ReactAudioContext);

  useEffect(() => {
    context.sequencers.forEach(seq => {
      seq.loadSample(context.context);
    })
    console.log(context)
  }, [])

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