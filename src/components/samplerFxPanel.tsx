import React from 'react';
import Switch from '@material-ui/core/Switch';

interface Props {
  audition: boolean;
  toggleAudition: () => void;
}

const SamplerFXPanel: React.FC<Props> = ({ audition, toggleAudition }) => {
  return (
    <div className='sampler-fx-panel'>
      <span>Play</span>
      <Switch
        color='primary'
        checked={!audition}
        onChange={toggleAudition}
      />
      <span>Select</span>
    </div>
  )
}

export default SamplerFXPanel;
