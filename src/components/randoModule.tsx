import React, { useContext, useEffect } from 'react';
import { ReactAudioContext } from '../app';
import H1 from './H1';

// const file = require('../../public/audio/Hat.wav')

const Rando: React.FC = () => {
  const {context, setContext} = useContext(ReactAudioContext);

  useEffect(() => {
    console.log(context);
    context.sequencers.forEach(seq => {
      fetch(seq.audioPath)
        .then(data => data.arrayBuffer())
        .then(arrayBuffer => context.context.decodeAudioData(arrayBuffer))
        .then(decodeAudioData => seq.audioBuffer = decodeAudioData)
        .then(() => console.log(seq))
    })
  }, [])

  return (
    <H1>
      Hello React, Typescript, Express, and Webpack
    </H1>
  )
}

export default Rando;