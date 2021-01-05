import { sounds } from "./sounds";
import { MonoSynth } from "./synth";

export interface StepRow {
  name: string; // name of row - helps to find this later
  audioPath: RequestInfo; // path to sound file
  audioBuffer: AudioBuffer | null; // decoded audio buffer
  gain: GainNode; // volume for this row - after buffer, before destination
  squares?: HTMLCollection | null; // used in scheduleNote
  isPlaying: boolean; // conditional check in schedule note
  shouldPlayNextLoop: boolean; // toggled by launch button
  pattern: (0 | 1)[]; // rhythmic pattern as an array
  loadSample: () => Promise<void>; // load the sample and assign to audioBuffer property
  errMsg: string;
}

const initializeRow = (
  context: AudioContext,
  name: string,
  audioPath: string,
  pattern: (0 | 1)[]
): StepRow => {
  const gain: GainNode = context.createGain();
  gain.connect(context.destination);
  return {
    name,
    audioPath,
    audioBuffer: null,
    gain,
    loadSample: async function () {
      // @ts-ignore
      // check if iOS and use callback syntax
      if (window.webkitAudioContext) {
        const data = await fetch(audioPath);
        const arrayBuffer = await data.arrayBuffer();
        context.decodeAudioData(
          arrayBuffer,
          (buffer) => {
            this.audioBuffer = buffer;
          },
          (err) => {
            this.errMsg = err.message;
            console.error(err);
          }
        );
      } else {
        // not iOS
        fetch(audioPath)
          .then((data) => data.arrayBuffer())
          .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
          .then((decodedAudioData) => (this.audioBuffer = decodedAudioData))
          .catch((err) => {
            this.errMsg = err.message;
            console.error(err);
          });
      }
    },
    pattern,
    isPlaying: true,
    shouldPlayNextLoop: true,
    errMsg: "",
  };
};

export interface AuditionMap {
  [key: number]: boolean;
}

export interface StepContext {
  context: AudioContext;
  destination: AudioDestinationNode;
  sequencers: StepRow[];
  synth: MonoSynth;
  isPlaying: boolean;
  tempo: number;
  swing: number;
  currentNote: number;
  nextNoteTime: number;
  nextCycleTime?: number;
  scheduleAheadTime: number;
  lookAhead: number;
  timerId: number | undefined;
  subscribeSquares: (fn: React.Dispatch<React.SetStateAction<number>>) => void;
  subscribers: React.Dispatch<React.SetStateAction<number>>[];
  updateTempo: (bpm: number) => void;
  updateSwing: (swingValue: number) => void;
  hostID?: string;
  audition: AuditionMap;
  setAudition: (idx: number) => void;
  endAudition: () => void;
}

export const createAudioContext = (): StepContext => {
  // @ts-ignore
  const audioCtx = window.AudioContext || window.webkitAudioContext;
  const context: AudioContext = new audioCtx();
  context.onstatechange = () => console.log(context.state);

  const destination: AudioDestinationNode = context.destination;
  const pattern: (1 | 0)[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const one = initializeRow(context, "JungleKick", sounds.one, [...pattern]);
  const two = initializeRow(context, "JungleSnare", sounds.two, [...pattern]);
  const three = initializeRow(context, "Clave1", sounds.three, [...pattern]);
  const four = initializeRow(context, "Cymbal", sounds.four, [...pattern]);
  const five = initializeRow(context, "HiTom", sounds.five, [...pattern]);
  const six = initializeRow(context, "SnareDry1", sounds.six, [...pattern]);
  const seven = initializeRow(context, "Clave2", sounds.seven, [...pattern]);
  const eight = initializeRow(context, "ClickClap", sounds.eight, [...pattern]);
  const nine = initializeRow(context, "Kick2", sounds.nine, [...pattern]);
  const ten = initializeRow(context, "SnareVerb", sounds.ten, [...pattern]);
  const eleven = initializeRow(context, "Clap", sounds.eleven, [...pattern]);
  const twelve = initializeRow(context, "SizzleHat", sounds.twelve, [
    ...pattern,
  ]);
  const thirteen = initializeRow(context, "Kick1", sounds.thirteen, [
    ...pattern,
  ]);
  const fourteen = initializeRow(context, "SnareDry2", sounds.fourteen, [
    ...pattern,
  ]);
  const fifteen = initializeRow(context, "Click", sounds.fifteen, [...pattern]);
  const sixteen = initializeRow(context, "HiHatDry", sounds.sixteen, [
    ...pattern,
  ]);

  const synth = new MonoSynth(context, "sawtooth");
  return {
    context,
    destination,
    sequencers: [
      one,
      two,
      three,
      four,
      five,
      six,
      seven,
      eight,
      nine,
      ten,
      eleven,
      twelve,
      thirteen,
      fourteen,
      fifteen,
      sixteen,
    ],
    synth,
    isPlaying: false,
    tempo: 90,
    swing: 0,
    currentNote: 0,
    nextNoteTime: 0,
    scheduleAheadTime: 0.1,
    lookAhead: 25.0,
    timerId: undefined,
    subscribers: [],
    audition: new Array(16).fill(null).reduce((a:AuditionMap, b:any, idx:number) => {
      a[idx] = false;
      return a;
    }, {}),
    setAudition: function (idx: number) {
      this.audition[idx] = !this.audition[idx];
    },
    endAudition: function () {
      for (let idx in this.audition) {
        this.audition[idx] = false;
      }
    },
    subscribeSquares: function (
      fn: React.Dispatch<React.SetStateAction<number>>
    ) {
      this.subscribers.push(fn);
    },
    updateTempo: function (bpm: number) {
      this.tempo = bpm;
    },
    updateSwing: function (swingValue: number) {
      this.swing = swingValue;
    },
  };
};
