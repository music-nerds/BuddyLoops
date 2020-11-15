import React from 'react';
import { StepRow } from '../audio/createContext';
import './stepRow.css';

interface Props {
  row: StepRow
  handleLaunch: () => void;
  launchEnabled: boolean;
  ref: React.RefObject<HTMLButtonElement>;
}

const LaunchButton = React.forwardRef<HTMLButtonElement, Props>(({row, handleLaunch, launchEnabled}, ref) => {
  return (
    <button className={`launch-btn ${launchEnabled && 'active-launch'}`} onClick={handleLaunch} ref={ref}>
      {row.name}
    </button>
  )
})

export default LaunchButton;