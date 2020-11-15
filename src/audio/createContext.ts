import { sounds } from './sounds';

export interface StepRow {
  name: string; // name of row - helps to find this later
  audioPath: RequestInfo; // path to sound file
  audioBuffer?: AudioBuffer; // decoded audio buffer
  squares?: HTMLElement[] | null; // used in scheduleNote
  isPlaying: boolean; // conditional check in schedule note
  shouldPlayNextLoop: boolean; // toggled by launch button 
}

const initializeRow = (name: string, audioPath: RequestInfo): StepRow => {
  return {
    name,
    audioPath,
    isPlaying: true,
    shouldPlayNextLoop: true
  }
}

export interface StepContext {
  context: AudioContext;
  destination: AudioDestinationNode;
  sequencers: StepRow[];
  isPlaying: boolean;
  tempo: number;
  currentNote: number;
  nextNoteTime: number;
  scheduleAheadTime: number;
  lookAhead: number;
  timerId: number | undefined;
}

export const createAudioContext = (): StepContext => {
  // @ts-ignore
  const audioCtx = window.AudioContext || window.webkitAudioContext;
  const context: AudioContext = new audioCtx();
  const destination: AudioDestinationNode = context.destination;

  return {
    context,
    destination,
    sequencers: [initializeRow('kick', sounds[0]), initializeRow('hat', sounds[1]),],
    isPlaying: false,
    tempo: 180,
    currentNote: 0,
    nextNoteTime: 0,
    scheduleAheadTime: 0.1,
    lookAhead: 25.0,
    timerId: undefined,
  };
}