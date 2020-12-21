import React from 'react';

interface SquareProps {
  beat: number;
  index: number;
  handleToggle: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  enabled: 0 | 1;
}

const SeqSquare: React.FC<SquareProps> = ({beat, index, handleToggle, enabled}) => {
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