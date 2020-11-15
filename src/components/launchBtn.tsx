import React from 'react';
import { StepRow } from '../audio/createContext';
import './stepRow.css';

interface Props {
  row: StepRow
  handleLaunch: () => void;
  ref: React.RefObject<HTMLButtonElement>;
}

const LaunchButton = React.forwardRef<HTMLButtonElement, Props>(({row, handleLaunch}, ref) => {
  return (
    <button className={`launch-btn ${row.shouldPlayNextLoop && 'active-launch'}`} onClick={handleLaunch} ref={ref}>
      {row.name}
    </button>
  )
})

export default LaunchButton;