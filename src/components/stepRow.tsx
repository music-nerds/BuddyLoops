import React, {useRef, useEffect, useContext, useState} from 'react';
import { ReactAudioContext } from '../app';
import './stepRow.css';
import LaunchButton from './launchBtn';
import SeqSquare from './seqSquare';
import { StepRow } from '../audio/createContext';

interface Row {
  row: StepRow;
}

const StepRow: React.FC<Row> = ({row}) => {
  const div = useRef<HTMLDivElement>(null);
  const launch = useRef<HTMLButtonElement>(null);
  const {context} = useContext(ReactAudioContext);
  const [beat, setBeat] = useState(0);
  const [launchEnabled, setLaunchEnabled] = useState(true);
  
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
    const index = target.getAttribute('data-index')!;
    if (target.getAttribute('aria-checked') === 'false') {
      target.setAttribute('aria-checked', 'true');
      row.pattern[Number(index)] = 1;
    } else {
      target.setAttribute('aria-checked', 'false');
      row.pattern[Number(index)] = 0;
    }
  }

  const handleLaunch = () => {
    row.shouldPlayNextLoop = !row.shouldPlayNextLoop;
    setLaunchEnabled(row.shouldPlayNextLoop);
  }
  return (
    <div className='flex-row step-row'>
      <LaunchButton row={row} handleLaunch={handleLaunch} launchEnabled={launchEnabled} ref={launch} />
      <div className='flex-row step-squares' ref={div} >
        {
          row.pattern.map((enabled, idx) => {
            return (
              <SeqSquare 
                handleToggle={handleToggle}
                enabled={enabled}
                index={idx}
                beat={beat}
              />
            )
          })
        }
      </div>
    </div>
  )
}

export default StepRow;