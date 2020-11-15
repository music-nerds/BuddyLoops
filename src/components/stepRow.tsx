import React, {useRef, useEffect, useContext, useState} from 'react';
import { ReactAudioContext } from '../app';
import './stepRow.css';
import LaunchButton from './launchBtn';

import { StepRow } from '../audio/createContext';

interface Row {
  row: StepRow;
}

const StepRow: React.FC<Row> = ({row}) => {
  const div = useRef<HTMLDivElement>(null);
  const launch = useRef<HTMLButtonElement>(null);
  const {context} = useContext(ReactAudioContext);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    row.squares = div.current && div.current.children;
    context.subscribeSquares(setBeat);
    fetch(row.audioPath)
        .then(data => data.arrayBuffer())
        .then(arrayBuffer => context.context.decodeAudioData(arrayBuffer))
        .then(decodeAudioData => row.audioBuffer = decodeAudioData)
  },[context, row])

  const handleToggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    if (target.getAttribute('aria-checked') === 'false') {
      target.setAttribute('aria-checked', 'true');
      target.style.backgroundColor = 'var(--green)';
    } else {
      target.setAttribute('aria-checked', 'false');
      target.style.backgroundColor = 'var(--bg)';
    }
  }
  const handleLaunch = () => {
    row.shouldPlayNextLoop = !row.shouldPlayNextLoop;
  }
  return (
    <div className='flex-row step-row'>
      <LaunchButton row={row} handleLaunch={handleLaunch} ref={launch} />
      <div className='flex-row step-squares' ref={div} >
        {
          new Array(16).fill(null).map((e, idx) => {
            return (
              <div key={idx} className={`seq-square ${beat === idx && context.isPlaying && 'active-beat'}`} aria-checked='false' onClick={handleToggle} />
            )
          })
        }
      </div>
    </div>
  )
}

export default StepRow;