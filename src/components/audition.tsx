import React, { useContext } from 'react';
import { ReactAudioContext } from '../app';
import { audition } from '../audio/audioFunctions';
import './stepRow.css';

const Audition: React.FC = () => {
  const { context } = useContext(ReactAudioContext);

  const auditionStart = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const id:number = Number(target.id);
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
              style={{ backgroundColor: '#B22222'}}
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