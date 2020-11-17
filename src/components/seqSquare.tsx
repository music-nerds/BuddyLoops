import React, { useRef, useEffect, useContext, useState } from 'react';
import { ReactAudioContext } from '../app';
import { StepRow } from '../audio/createContext';

interface SquareProps {
  beat: number;
  index: number;
  handleToggle: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  enabled: 0 | 1;
}

const SeqSquare: React.FC<SquareProps> = ({beat, index, handleToggle, enabled}) => {
  const {context} = useContext(ReactAudioContext);
  return (
    <div 
      data-index={index}
      className={`seq-square ${beat === index ? context.isPlaying ? 'active-beat' : '' : ''}`}
      aria-checked={enabled === 1 ? 'true' : 'false'}
      onClick={handleToggle}
    />

  )
}

export default SeqSquare;