import { AnalogDelay } from "./effects";
import presets from "./synthPresets";

export const notes = {
  C: 261.63,
  Db: 277.18,
  D: 293.66,
  Eb: 311.13,
  E: 329.63,
  F: 349.23,
  Gb: 369.99,
  G: 392.0,
  Ab: 415.3,
  A: 440.0,
  Bb: 466.16,
  B: 493.88,
};

export class MonoSynth {
  context: AudioContext;
  osc: OscillatorNode;
  osc2: OscillatorNode;
  osc3: OscillatorNode;
  output: GainNode;
  merger: ChannelMergerNode;
  filter: BiquadFilterNode;
  attackTime: number;
  releaseTime: number;
  portamentoTime: number;
  noteLength: number;
  isPlaying: boolean;
  shouldPlayNextLoop: boolean;
  arpNotes: number[];
  arpIndex: number;
  spread: boolean;
  spreadAmount: number;
  fmOsc: OscillatorNode;
  fmOscGain: GainNode;
  isFmOscConnected: boolean;
  delay: AnalogDelay;
  name: string;
  constructor(context: AudioContext, type: OscillatorType) {
    this.context = context;
    this.osc = this.context.createOscillator();
    this.osc.type = type;
    this.osc2 = this.context.createOscillator();
    this.osc2.type = type;
    this.osc3 = this.context.createOscillator();
    this.osc3.type = "square";
    this.output = this.context.createGain();
    this.output.gain.value = 0;
    this.filter = this.context.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 5000;
    this.merger = context.createChannelMerger();
    this.delay = new AnalogDelay(this.context);
    this.osc.connect(this.merger, 0, 0);
    this.osc2.connect(this.merger, 0, 1);
    this.osc3.connect(this.merger, 0, 2);
    this.merger.connect(this.filter);
    this.filter.connect(this.output);
    this.output.connect(this.context.destination);
    this.output.connect(this.delay.input);
    this.osc.start();
    this.osc2.start();
    this.osc3.start();
    this.attackTime = 0.01;
    this.releaseTime = 0.25;
    this.portamentoTime = 0;
    this.noteLength = 0.5;
    this.isPlaying = true;
    this.shouldPlayNextLoop = true;
    this.arpNotes = [];
    this.arpIndex = 0;
    this.spread = true;
    this.spreadAmount = 5;
    this.fmOsc = context.createOscillator();
    this.fmOsc.type = "sine";
    this.fmOscGain = context.createGain();
    this.fmOscGain.gain.value = 100;
    this.isFmOscConnected = false;
    // this.fmOsc.connect(this.fmOscGain);
    this.fmOscGain.connect(this.osc.frequency);
    this.fmOsc.start();
    this.name = "buzzSaw";
  }

  pattern: (0 | 1)[][] = [
    [1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];
  scale: number[] = [
    notes["D"],
    notes["F"],
    notes["G"],
    notes["A"],
    notes["C"] * 2,
    notes["D"] * 2,
    notes["F"] * 2,
    notes["G"] * 2,
    notes["A"] * 2,
    notes["C"] * 4,
    notes["D"] * 4,
  ];
  octave: number = 1 / 4;
  updatePattern = (value: 0 | 1, beat: number, note: number): void => {
    this.pattern[beat][note] = value;
    // only one note per column permitted
    if (value === 1) {
      this.pattern[beat].forEach((_, i) => {
        if (i !== note) {
          this.pattern[beat][i] = 0;
        }
      });
    }
  };
  clearPattern(): void {
    this.pattern = this.pattern.map((p) => [0, 0, 0, 0, 0, 0]);
  }

  playNote(note: number, time: number, tempo: number): void {
    // set frequency
    this.fmOsc.frequency.setValueAtTime(note / 2, time);
    if (this.spread) {
      this.osc.frequency.setValueAtTime(
        this.freqPlusCents(note, this.spreadAmount),
        time
      );
      this.osc2.frequency.setValueAtTime(
        this.freqMinusCents(note, this.spreadAmount),
        time
      );
      this.osc3.frequency.setValueAtTime(note, time);
    } else {
      this.osc.frequency.setValueAtTime(note, time);
      this.osc2.frequency.setValueAtTime(note, time);
      this.osc3.frequency.setValueAtTime(note, time);
    }
    // manage gain events
    this.output.gain.cancelScheduledValues(time);
    // this.output.gain.setValueAtTime(this.getGainValue(), time);
    this.output.gain.setTargetAtTime(0.4, time, this.attackTime / 5);

    this.stopNote(time + (60 / (tempo * 4)) * this.noteLength);
  }

  stopNote(time: number): void {
    // turn down the volume with releaseTime
    this.output.gain.cancelScheduledValues(time);
    this.output.gain.setTargetAtTime(0, time + 0.0001, this.releaseTime / 5);
  }

  getGainValue(): number {
    return this.output.gain.value;
  }

  freqPlusCents(freq: number, cents: number): number {
    // 1200th root of 2 is 1 cent
    return freq * Math.pow(1.0005777895065548, cents);
  }
  freqMinusCents(freq: number, cents: number): number {
    return freq / Math.pow(1.0005777895065548, cents);
  }
  updateDelayTime(tempo: number) {
    // default is dotted eighth note
    const time = (60 / tempo) * 0.75;
    this.delay.setDelayTime(time);
  }
  changePreset(key: string) {
    if (key in presets) {
      const data = presets[key];
      this.name = data.name;
      this.osc.type = data.oscType;
      this.osc2.type = data.osc2Type;
      this.osc3.type = data.osc3Type;
      if (data.isFmOscConnected) {
        if (!this.isFmOscConnected) this.fmOsc.connect(this.fmOscGain);
      } else {
        if (this.isFmOscConnected) this.fmOsc.disconnect(this.fmOscGain);
      }
      this.isFmOscConnected = data.isFmOscConnected;
      this.attackTime = data.attackTime;
      this.noteLength = data.noteLength;
      this.releaseTime = data.releaseTime;
      this.delay.setDelayTime(data.delayTime);
      this.delay.setDelayFeedback(data.delayFeedback);
      this.delay.setDelayGain(data.delayGain);
      this.filter.frequency.value = data.filterFreq;
      this.filter.Q.value = data.q;
    }
  }
}
