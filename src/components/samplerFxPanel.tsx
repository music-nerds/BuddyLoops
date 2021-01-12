import React, { useContext } from 'react';
import Switch from '@material-ui/core/Switch';
import { ReactAudioContext } from '../app';
import PlayArrowSharpIcon from '@material-ui/icons/PlayArrowSharp';
import PauseIcon from '@material-ui/icons/Pause';
import './sampler.css';

interface Props {
  audition: boolean;
  toggleAudition: () => void;
}

const SamplerFXPanel: React.FC<Props> = ({ audition, toggleAudition }) => {
  const { context } = useContext(ReactAudioContext);

  const handleDrumLaunch = () => {
    context.toggleSequencersEnabled();
  }

  return (
    <div className='sampler-fx-panel'>
      <div>
        <span>Play</span>
        <Switch
          color='primary'
          checked={!audition}
          onChange={toggleAudition}
        />
        <span>Select</span>
      </div>
      <div className='fx-panel-launch' onClick={handleDrumLaunch}>
        {
          context.sequencersShouldPlayNextLoop
          ? <PauseIcon fontSize='large' />
          : <PlayArrowSharpIcon fontSize='large' />
        }
      </div>
    </div>
  )
}

export default SamplerFXPanel;
