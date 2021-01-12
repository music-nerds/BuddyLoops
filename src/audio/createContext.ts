import { sounds } from "./sounds";
import { MonoSynth } from "./synth";
import { kilmer140bpm } from "./drumPatterns";

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
  sequencersArePlaying: boolean;
  sequencersShouldPlayNextLoop: boolean;
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
  endAudition: (id:number) => void;
  toggleSequencersEnabled: () => void;
}

export const createAudioContext = (): StepContext => {
  // @ts-ignore
  const audioCtx = window.AudioContext || window.webkitAudioContext;
  const context: AudioContext = new audioCtx();
  context.onstatechange = () => console.log(context.state);

  const destination: AudioDestinationNode = context.destination;
  const one = initializeRow(context, "JungleKick", sounds.one, kilmer140bpm[0]);
  const two = initializeRow(
    context,
    "JungleSnare",
    sounds.two,
    kilmer140bpm[1]
  );
  const three = initializeRow(context, "Clave1", sounds.three, kilmer140bpm[2]);
  const four = initializeRow(context, "Cymbal", sounds.four, kilmer140bpm[3]);
  const five = initializeRow(context, "HiTom", sounds.five, kilmer140bpm[4]);
  const six = initializeRow(context, "SnareDry1", sounds.six, kilmer140bpm[5]);
  const seven = initializeRow(context, "Clave2", sounds.seven, kilmer140bpm[6]);
  const eight = initializeRow(
    context,
    "ClickClap",
    sounds.eight,
    kilmer140bpm[7]
  );
  const nine = initializeRow(context, "Kick2", sounds.nine, kilmer140bpm[8]);
  const ten = initializeRow(context, "SnareVerb", sounds.ten, kilmer140bpm[9]);
  const eleven = initializeRow(
    context,
    "Clap",
    sounds.eleven,
    kilmer140bpm[10]
  );
  const twelve = initializeRow(
    context,
    "SizzleHat",
    sounds.twelve,
    kilmer140bpm[11]
  );
  const thirteen = initializeRow(
    context,
    "Kick1",
    sounds.thirteen,
    kilmer140bpm[12]
  );
  const fourteen = initializeRow(
    context,
    "SnareDry2",
    sounds.fourteen,
    kilmer140bpm[13]
  );
  const fifteen = initializeRow(
    context,
    "Click",
    sounds.fifteen,
    kilmer140bpm[14]
  );
  const sixteen = initializeRow(
    context,
    "HiHatDry",
    sounds.sixteen,
    kilmer140bpm[15]
  );

  const synth = new MonoSynth(context, "square");
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
    sequencersArePlaying: true,
    sequencersShouldPlayNextLoop: true,
    synth,
    isPlaying: false,
    tempo: 140,
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
      this.audition[idx] = true;
    },
    endAudition: function (id) {
      this.audition[id] = false;
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
    toggleSequencersEnabled: function () {
      this.sequencersShouldPlayNextLoop = !this.sequencersShouldPlayNextLoop;
    },
  };
};
