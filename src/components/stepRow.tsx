import React, {useRef, useEffect, useContext, useState} from 'react';
import { ReactAudioContext } from '../app';
import { useHistory } from 'react-router-dom';
import './stepRow.css';
import LaunchButton from './launchBtn';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

import SeqSquare from './seqSquare';
import { StepRow } from '../audio/createContext';

interface Row {
  row: StepRow;
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
    const index = target.getAttribute('data-index')!;
    if (target.getAttribute('aria-checked') === 'false') {
      target.setAttribute('aria-checked', 'true');
      row.pattern[Number(index)] = 1;
    } else {
      target.setAttribute('aria-checked', 'false');
      row.pattern[Number(index)] = 0;
    }
    socket.emit('patternChange', pathname.slice(1), { name: row.name, pattern: row.pattern, id: pathname.slice(1) })
  }

  useEffect(() => {

    socket.on('connect', () => {
      socket.emit('handshake', pathname.slice(1));
    })

    socket.on('patternChange', (data) => {
      const something = context.sequencers.find(seq => seq.name === data.name);
      if (something) {
        something.pattern = data.pattern;
      }
      // setContext({...context})
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
              />
            )
          })
        }
      </div>
    </div>
  )
}

export default StepRow;