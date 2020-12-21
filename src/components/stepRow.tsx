import React, {useRef, useEffect, useContext, useState} from 'react';
import { ReactAudioContext, SocketContext } from '../app';
import { StepRow } from '../audio/createContext';
import './stepRow.css';
import LaunchButton from './launchBtn';

import SeqSquare from './seqSquare';

interface Row {
  row: StepRow;
  id: string;
  beat: number
}

interface PatternChange {
  name: string;
  pattern: (0|1)[];
  id: string;
}

const StepSeqRow: React.FC<Row> = ({row, id, beat}) => {
  const div = useRef<HTMLDivElement>(null);
  const launch = useRef<HTMLButtonElement>(null);
  const {context, setContext} = useContext(ReactAudioContext);
  const socket = useContext(SocketContext);

  
  const [launchEnabled, setLaunchEnabled] = useState(true);

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
    socket.emit('patternChange', id, { name: row.name, pattern: row.pattern, id })
  }
  useEffect(() => {
    row.squares = div.current && div.current.children;
  },[row])
  useEffect(() => {
    socket.on('patternChange', (data: PatternChange) => {
      const seq = context.sequencers.find(seq => seq.name === data.name);
      if (seq) {
        seq.pattern = data.pattern;
      }
      if(!context.isPlaying){
        // causes bug if isPlaying is true
        // stop button loses reference to context
        setContext({...context});
      }
    })
    socket.on('receiveRowLaunch', (name: string) => {
      if(name === row.name){
        row.shouldPlayNextLoop = !row.shouldPlayNextLoop;
        setLaunchEnabled(row.shouldPlayNextLoop);
      }
    })
    return () => {
      socket.off('patternChange');
      socket.off('receiveRowLaunch')
    }
  }, [context, setContext, socket, row])

  const handleLaunch = () => {
    socket.emit('sendRowLaunch', id, row.name)
  }
  return (
    <div className='step-row'>
      <div className="row-controls">
        <LaunchButton row={row} handleLaunch={handleLaunch} launchEnabled={launchEnabled} ref={launch} />
        <p>Other controls here</p>
      </div>
      <div className='step-squares' ref={div} >
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
        {/* <Knob row={row} /> */}
      </div>
    </div>
  )
}

export default StepSeqRow;