export interface SynthPreset {
  name: string;
  oscType: OscillatorType;
  osc2Type: OscillatorType;
  osc3Type: OscillatorType;
  isFmOscConnected: boolean;
  fmOscGain?: number;
  attackTime: number;
  noteLength: number;
  releaseTime: number;
  delayTime: number;
  delayGain: number;
  delayFeedback: number;
  filterFreq: number;
  q: number;
}

const buzzSaw: SynthPreset = {
  name: "buzzSaw",
  oscType: "sawtooth",
  osc2Type: "sawtooth",
  osc3Type: "square",
  isFmOscConnected: false,
  attackTime: 0.01,
  noteLength: 0.5,
  releaseTime: 0.25,
  delayTime: 0.36,
  delayGain: 0,
  delayFeedback: 0,
  filterFreq: 5000,
  q: 1,
};
const deepSine: SynthPreset = {
  name: "deepSine",
  oscType: "sine",
  osc2Type: "sawtooth",
  osc3Type: "sawtooth",
  isFmOscConnected: true,
  fmOscGain: 100,
  attackTime: 0.01,
  noteLength: 1,
  releaseTime: 1,
  delayTime: 0.36,
  delayGain: 0,
  delayFeedback: 0,
  filterFreq: 2000,
  q: 1,
};

interface PresetLibrary {
  [key: string]: SynthPreset;
}

const presets: PresetLibrary = {
  buzzSaw,
  deepSine,
};

export default presets;
