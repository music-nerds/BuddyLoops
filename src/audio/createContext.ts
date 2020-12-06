import { sounds } from './sounds';

export interface StepRow {
  name: string; // name of row - helps to find this later
  audioPath: RequestInfo; // path to sound file
  audioBuffer: AudioBuffer | null; // decoded audio buffer
  gain: GainNode; // volume for this row - after buffer, before destination
  squares?: HTMLCollection | null; // used in scheduleNote
  isPlaying: boolean; // conditional check in schedule note
  shouldPlayNextLoop: boolean; // toggled by launch button 
  pattern: (0|1)[]; // rhythmic pattern as an array
  loadSample: () => void; // load the sample and assign to audioBuffer property
}

const initializeRow = (context: AudioContext, name: string, audioPath: RequestInfo, pattern: (0|1)[]): StepRow => {
  const gain: GainNode = context.createGain();
  gain.connect(context.destination);
  return {
    name,
    audioPath,
    audioBuffer: null,
    gain,
    loadSample: function(){
      fetch(audioPath)
      .then(data => data.arrayBuffer())
      .then(arrayBuffer => context.decodeAudioData(arrayBuffer)) // TODO: Refactor for iOS support
      .then(decodedAudioData => this.audioBuffer = decodedAudioData)
    },
    pattern,
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
  swing: number;
  currentNote: number;
  nextNoteTime: number;
  scheduleAheadTime: number;
  lookAhead: number;
  timerId: number | undefined;
  subscribeSquares: (fn: React.Dispatch<React.SetStateAction<number>>) => void;
  subscribers: React.Dispatch<React.SetStateAction<number>>[];
  updateTempo: (bpm: number) => void;
  updateSwing: (swingValue: number) => void;
}

export const createAudioContext = (): StepContext => {
  // @ts-ignore
  const audioCtx = window.AudioContext || window.webkitAudioContext;
  const context: AudioContext = new audioCtx();
  const destination: AudioDestinationNode = context.destination;
  const hatPattern: (1|0)[] = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
  const snarePattern: (1|0)[] = [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0];
  const kickPattern: (1|0)[] = [1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0];
  const hat = initializeRow(context, 'hat', sounds.hat, hatPattern);
  const snare = initializeRow(context, 'snare', sounds.snare, snarePattern);
  const kick = initializeRow(context, 'kick', sounds.kick, kickPattern);
  return {
    context,
    destination,
    sequencers: [hat, snare, kick],
    isPlaying: false,
    tempo: 90,
    swing: 0,
    currentNote: 0,
    nextNoteTime: 0,
    scheduleAheadTime: 0.1,
    lookAhead: 25.0,
    timerId: undefined,
    subscribers: [],
    subscribeSquares: function(fn: React.Dispatch<React.SetStateAction<number>>){
      this.subscribers.push(fn);
    },
    updateTempo: function(bpm: number) {
      this.tempo = bpm;
    },
    updateSwing: function(swingValue: number) {
      this.swing = swingValue;
    }
  };
}