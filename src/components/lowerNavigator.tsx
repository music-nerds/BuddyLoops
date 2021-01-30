import './lowerNavigator.css';
import React from 'react';
import drum from '../../images/icons/drum.png';
import piano from '../../images/icons/piano.png';

interface Props {
  toggleInstrument: (instrument: string) => void;
  instrument: string;
}

const LowerNavigator: React.FC<Props> = ({ toggleInstrument, instrument }) => {
  return (
    <div className='lower-navigator'>
      <div className='lower-navigator-container'>

        <div 
          className={instrument === 'sampler' ? 'lower-navigator-selected' : 'lower-navigator-tab'}
          onClick={() => toggleInstrument('sampler')}
          id='drum-tab'
        >
          <img
            className='navigator-icon'
            src={drum}
            alt='drum icon'
            onClick={() => toggleInstrument('sampler')}
          />
        </div>

        <div
          className={instrument === 'synth' ? 'lower-navigator-selected' : 'lower-navigator-tab'}
          onClick={() => toggleInstrument('synth')}
          id='synth-tab'
        >
          <img 
            className='navigator-icon'
            src={piano} 
            alt='synth icon'
            onClick={() => toggleInstrument('synth')}
          />
        </div>

      </div>
    </div>
  )
}

export default LowerNavigator;