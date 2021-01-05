import React, { useState, useContext, useEffect } from 'react';
import { ReactAudioContext } from '../app';
import { audition } from '../audio/audioFunctions';

interface Props {
  selectPattern: (pattern: number) => void;
  currPattern: number;
}

const Audition: React.FC<Props> = ({ selectPattern, currPattern }) => {
  const {context, setContext} = useContext(ReactAudioContext);
  const [selected, setSelected] = useState(currPattern);

  useEffect(() => {
    window.addEventListener('mousedown', (e:any) => {
      console.log(e);
    })
  }, [])

  const sampleAudition = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const id:number = Number(target.id);
    if (!context.isPlaying) {
      audition(context, context.sequencers[id]);
    }
  }
  return (
    <div>
      {
        new Array(16).fill(null).map((n, idx) => (
          context.sequencers[idx]
          ? <div
              key={idx}
              id={`${idx}`}
              onMouseDown={sampleAudition}
              onTouchStart={sampleAudition}
              onTouchEnd={(e: React.TouchEvent<HTMLDivElement>) => e.preventDefault()}
              style={{ backgroundColor: '#B22222'}}
              className={idx === selected ? 'seq-square active-square' : 'seq-square'}
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