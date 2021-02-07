import { sounds } from "./sounds";
import { MonoSynth } from "./synth";
import { kilmer125bpm } from "./drumPatterns";

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
  clearPattern: () => void;
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
    clearPattern: function () {
      this.pattern = new Array(this.pattern.length).fill(0);
    },
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
  endAudition: (id: number) => void;
  toggleSequencersEnabled: () => void;
  clearAllPatterns: () => void;
  loadNewSet: (set: any) => void;
}

export const createAudioContext = (): StepContext => {
  // @ts-ignore
  const audioCtx = window.AudioContext || window.webkitAudioContext;
  const context: AudioContext = new audioCtx();
  context.onstatechange = () => console.log(context.state);

  const destination: AudioDestinationNode = context.destination;
  const one = initializeRow(context, "JungleKick", sounds.one, kilmer125bpm[0]);
  const two = initializeRow(
    context,
    "JungleSnare",
    sounds.two,
    kilmer125bpm[1]
  );
  const three = initializeRow(context, "Clave1", sounds.three, kilmer125bpm[2]);
  const four = initializeRow(context, "Cymbal", sounds.four, kilmer125bpm[3]);
  const five = initializeRow(context, "HiTom", sounds.five, kilmer125bpm[4]);
  const six = initializeRow(context, "SnareDry1", sounds.six, kilmer125bpm[5]);
  const seven = initializeRow(context, "Clave2", sounds.seven, kilmer125bpm[6]);
  const eight = initializeRow(
    context,
    "ClickClap",
    sounds.eight,
    kilmer125bpm[7]
  );
  const nine = initializeRow(context, "Kick2", sounds.nine, kilmer125bpm[8]);
  const ten = initializeRow(context, "SnareVerb", sounds.ten, kilmer125bpm[9]);
  const eleven = initializeRow(
    context,
    "Clap",
    sounds.eleven,
    kilmer125bpm[10]
  );
  const twelve = initializeRow(
    context,
    "SizzleHat",
    sounds.twelve,
    kilmer125bpm[11]
  );
  const thirteen = initializeRow(
    context,
    "Kick1",
    sounds.thirteen,
    kilmer125bpm[12]
  );
  const fourteen = initializeRow(
    context,
    "SnareDry2",
    sounds.fourteen,
    kilmer125bpm[13]
  );
  const fifteen = initializeRow(
    context,
    "Click",
    sounds.fifteen,
    kilmer125bpm[14]
  );
  const sixteen = initializeRow(
    context,
    "HiHatDry",
    sounds.sixteen,
    kilmer125bpm[15]
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
    tempo: 125,
    swing: 10,
    currentNote: 0,
    nextNoteTime: 0,
    scheduleAheadTime: 0.1,
    lookAhead: 25.0,
    timerId: undefined,
    subscribers: [],
    audition: new Array(16)
      .fill(null)
      .reduce((a: AuditionMap, b: any, idx: number) => {
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
    clearAllPatterns: function () {
      this.sequencers.forEach((s) => s.clearPattern());
    },
    loadNewSet: function (set) {
      this.updateTempo(set.tempo);
      this.updateSwing(set.swing);
      this.sequencers = set.steprows.map((row: any) => {
        const seq = initializeRow(this.context, row.name, row.audioPath, row.pattern)
        return seq;
      })
      this.synth.loadNewPattern(set.synthPattern);
    }
  };
};
