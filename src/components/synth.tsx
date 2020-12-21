import React, { useContext } from 'react';
import { ReactAudioContext } from '../app';
import MonoSynthControls from './monoSynthControls';
import MonoSynthSquares from './monoSynthSquares';
import './synth.css';
 
interface MonoSynthProps {
  beat: number;
}

const MonoSynth: React.SFC<MonoSynthProps> = ({beat}) => {
  const { context } = useContext(ReactAudioContext);
  const { synth } = context;

  return ( 
    <div id="synth">
      <MonoSynthControls synth={synth} />
      <MonoSynthSquares synth={synth} beat={beat} />
    </div>
   );
}
 
export default MonoSynth;