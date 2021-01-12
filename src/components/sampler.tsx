import React, { useState, useEffect, useContext } from 'react';
import { ReactAudioContext, SocketContext } from '../app';
import StepRow from './stepRow';
import SampleSelector from './sampleSelector';
import Audition from './audition';
import SoundbankFxPanel from './soundbankFxPanel';
import PatternFxPanel from './patternFxPanel';
import GridOnIcon from '@material-ui/icons/GridOn';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import './sampler.css';

interface Props {
  socketID: string;
  beat: number;
  currPattern: number;
  selectPattern: (pattern: number) => void;
  view: string;
  toggleView: (view: string) => void;
  audition: boolean;
  toggleAudition: () => void;
}

interface PatternChange {
  name: string;
  pattern: (0 | 1)[];
  id: string;
}

const Sampler: React.FC<Props> = ({ socketID, beat, currPattern, selectPattern, view, toggleView, audition, toggleAudition }) => {
  console.log('VIEW', view)
  const {context, setContext} = useContext(ReactAudioContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("patternChange", (data: PatternChange) => {
      const seq = context.sequencers.find((seq) => seq.name === data.name);
      if (seq) {
        seq.pattern = data.pattern;
      }
      if (!context.isPlaying) {
        // causes bug if isPlaying is true
        // stop button loses reference to context
        setContext({ ...context });
      }
    });

    socket.on('receiveRowLaunch', (name: string) => {
      // if(name === context.sequencers[currPattern].name){
      //   sequencer.shouldPlayNextLoop = !row.shouldPlayNextLoop;
      //   // setLaunchEnabled(row.shouldPlayNextLoop);
      // }
      const sequencer = context.sequencers.find(seq => seq.name === name)!;
      sequencer.shouldPlayNextLoop = !sequencer.shouldPlayNextLoop
    })

    socket.on('receiveDrumToggle', () => {
      context.toggleSequencersEnabled();
    })

    socket.on('receiveMomentaryOn', (id:number) => {
      context.setAudition(id);
    })

    socket.on('receiveMomentaryOff', (id:number) => {
      context.endAudition(id);
    })

    return () => {
      socket.off("patternChange");
      socket.off('receiveRowLaunch');
      socket.off('receiveDrumToggle');
      socket.off('sendMomentaryOn');
      socket.off('sendMomentaryOff');
    };
    // }, [context, context.sequencers, row])
  }, [context, context.sequencers, setContext, socket]);

  return (
    <div className="sampler-container">
      <div className="sampler-tabs">
        <div
          id="soundbank"
          className={
            view === "soundbank" ? "sampler-tab tab-selected" : "sampler-tab"
          }
          onClick={() => toggleView("soundbank")}
        >
          <MusicNoteIcon />
        </div>
        <div
          id="pattern"
          className={
            view === "pattern" ? "sampler-tab tab-selected" : "sampler-tab"
          }
          onClick={() => toggleView("pattern")}
        >
          <GridOnIcon />
        </div>
      </div>
      {
        view === 'soundbank' && 
        <SoundbankFxPanel audition={audition} toggleAudition={toggleAudition} />
      }
      {
        view === 'pattern' && 
        <PatternFxPanel currPattern={currPattern} />
      }
      <div className='sampler-view'>
        {
          view === 'pattern' &&
          <StepRow row={context.sequencers[currPattern]} id={socketID} beat={beat} />
        }
        {
          view === 'soundbank' && !audition &&
          <SampleSelector beat={beat} currPattern={currPattern} selectPattern={selectPattern} />
        }
        {
          view === 'soundbank' && audition &&
          <Audition selectPattern={selectPattern} beat={beat} />
        }
      </div>
    </div>
  );
};

export default Sampler;
