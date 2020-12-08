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
  loadSample: () => Promise<void>; // load the sample and assign to audioBuffer property
  errMsg: string;
}

const initializeRow = (context: AudioContext, name: string, audioPath: string, pattern: (0|1)[]): StepRow => {
  const gain: GainNode = context.createGain();
  gain.connect(context.destination);
  return {
    name,
    audioPath,
    audioBuffer: null,
    gain,
    loadSample: async function(){
      // @ts-ignore 
      // check if iOS and use callback syntax
      if(window.webkitAudioContext){
        const data = await fetch(audioPath);
        const arrayBuffer = await data.arrayBuffer();
        context.decodeAudioData(arrayBuffer, (buffer) => {
          this.audioBuffer = buffer;
        }, (err) => {
          this.errMsg = err.message;
          console.error(err);
        })
      } else {
      // not iOS
        fetch(audioPath)
        .then(data => data.arrayBuffer())
        .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
        .then(decodedAudioData => this.audioBuffer = decodedAudioData)
        .catch((err) => {
          this.errMsg = err.message;
          console.error(err);
        })
      }
    },
    pattern,
    isPlaying: true,
    shouldPlayNextLoop: true,
    errMsg: ''
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
  hostID?: string;
}

export const createAudioContext = (): StepContext => {
  // @ts-ignore
  const audioCtx = window.AudioContext || window.webkitAudioContext;
  const context: AudioContext = new audioCtx();
  context.onstatechange = () => console.log(context.state); 

  const destination: AudioDestinationNode = context.destination;
  const hatPattern: (1|0)[] = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
  const snarePattern: (1|0)[] = [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0];
  const kickPattern: (1|0)[] = [1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0];
  const hat = initializeRow(context,'hat', sounds.hat, hatPattern);
  const snare = initializeRow(context,'snare', sounds.snare, snarePattern);
  const kick = initializeRow(context,'kick', sounds.kick, kickPattern);
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