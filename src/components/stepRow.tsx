import React, {useRef, useEffect, useContext, useState} from 'react';
import { ReactAudioContext } from '../app';
import { useHistory } from 'react-router-dom';
import { StepRow } from '../audio/createContext';
import './stepRow.css';
import LaunchButton from './launchBtn';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

import SeqSquare from './seqSquare';
import Knob from './knob';

interface Row {
  row: StepRow;
}

interface PatternChange {
  name: string;
  pattern: (0|1)[];
  pathname: string;
}

const StepRow: React.FC<Row> = ({row}) => {
  const div = useRef<HTMLDivElement>(null);
  const launch = useRef<HTMLButtonElement>(null);
  const {context, setContext} = useContext(ReactAudioContext);
  const [beat, setBeat] = useState(0);
  const [launchEnabled, setLaunchEnabled] = useState(true);
  const { location: { pathname } } = useHistory();

  const socket = io(SOCKET_URL);

  useEffect(() => {
    row.squares = div.current && div.current.children;
    context.subscribeSquares(setBeat);
  },[context, row])

  const handleToggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    const index = Number(target.getAttribute('data-index'))!;
    if (target.getAttribute('aria-checked') === 'false') {
      target.setAttribute('aria-checked', 'true');
      row.pattern[index] = 1;
    } else {
      target.setAttribute('aria-checked', 'false');
      row.pattern[index] = 0;
    }
    socket.emit('patternChange', pathname.slice(1), { name: row.name, pattern: row.pattern, id: pathname.slice(1) })
  }

  useEffect(() => {

    socket.on('connect', () => {
      socket.emit('handshake', pathname.slice(1));
    })

    socket.on('patternChange', (data: PatternChange) => {
      const seq = context.sequencers.find(seq => seq.name === data.name);
      if (seq) {
        seq.pattern = data.pattern;
      }
      setContext({...context});
    })
  }, [])

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
                key={idx}
              />
            )
          })
        }
        <Knob row={row} />
      </div>
    </div>
  )
}

export default StepRow;