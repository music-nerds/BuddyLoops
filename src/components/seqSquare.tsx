import React, { useContext } from 'react';
import { ReactAudioContext } from '../app';
import { StepRow } from '../audio/createContext';

interface SquareProps {
  beat: number;
  index: number;
  handleToggle: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  enabled: 0 | 1;
}

const SeqSquare: React.FC<SquareProps> = ({beat, index, handleToggle, enabled}) => {
  const { context } = useContext(ReactAudioContext);
  return (
    <div 
      data-index={index}
      className={`seq-square ${beat === index ? 'active-beat' : ''}`}
      aria-checked={enabled === 1 ? 'true' : 'false'}
      onClick={handleToggle}
    />
  )
}

export default SeqSquare;