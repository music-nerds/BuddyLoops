import React, { useContext } from 'react';
import { ReactAudioContext } from '../app';
import { audition } from '../audio/audioFunctions';
import './stepRow.css';

interface Props {
  selectPattern: (pattern: number) => void;
  beat: number;
}

const Audition: React.FC<Props> = ({ selectPattern, beat }) => {
  const { context } = useContext(ReactAudioContext);

  const auditionStart = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const id:number = Number(target.id);
    selectPattern(id);
    if (!context.isPlaying) {
      audition(context, context.sequencers[id]);
    } else {
      context.setAudition(id);
    }
  }
  
  const auditionEnd = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const id:number = Number(target.id);
    event.preventDefault();
    context.endAudition();
  }

  return (
    <div>
      {
        new Array(16).fill(null).map((n, idx) => (
          context.sequencers[idx]
          ? <div
              key={idx}
              id={`${idx}`}
              onMouseDown={auditionStart}
              onMouseUp={auditionEnd}
              onTouchStart={auditionStart}
              onTouchEnd={auditionEnd}
              style={{
                backgroundColor: `${
                  (context.sequencers[idx].pattern[beat] === 1 && context.sequencersArePlaying)
                    ? "var(--highlight)"
                    : "var(--blue)"
                }`,
              }}
              className='aud-square'
            >
              <span>
                {context.sequencers[idx].name}
              </span>
            </div>
          : <div key={idx}className='seq-square'></div>
        ))
      }
    </div>
  )
}

export default Audition;