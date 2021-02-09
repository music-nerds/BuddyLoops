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
  output: GainNode;
  filter: BiquadFilterNode;
  attackTime: number;
  releaseTime: number;
  portamentoTime: number;
  noteLength: number;
  isPlaying: boolean;
  shouldPlayNextLoop: boolean;
  arpNotes: number[];
  arpStyle: string;
  arpIndex: number;
  arpEnabled: boolean;
  constructor(context: AudioContext, type: OscillatorType) {
    this.context = context;
    this.osc = this.context.createOscillator();
    this.osc.type = type;
    this.output = this.context.createGain();
    this.output.gain.value = 0;
    this.filter = this.context.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 5000;
    this.osc.connect(this.filter);
    this.filter.connect(this.output);
    this.output.connect(this.context.destination);
    this.osc.start();
    this.attackTime = 0.01;
    this.releaseTime = 0.25;
    this.portamentoTime = 0;
    this.noteLength = 0.5;
    this.isPlaying = true;
    this.shouldPlayNextLoop = true;
    this.arpNotes = [];
    this.arpStyle = "order";
    this.arpIndex = 0;
    this.arpEnabled = true;
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

  loadNewPattern(_pattern: (0 | 1)[][]): void {
    this.pattern = _pattern;
  }

  playNote(note: number, time: number, tempo: number): void {
    // set frequency
    this.osc.frequency.setValueAtTime(note, time);
    // manage gain events
    this.output.gain.cancelScheduledValues(time);
    this.output.gain.setValueAtTime(this.getGainValue(), time);
    this.output.gain.setTargetAtTime(0.4, time + 0.0001, this.attackTime / 5);

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
}
