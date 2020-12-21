export const notes = {
  C: 261.63,
  Db: 277.18,
  D: 293.66,
  Eb: 311.13,
  E: 329.63,
  F: 349.23,
  Gb: 369.99,
  G: 392.00,
  Ab: 415.30,
  A: 440.00,
  Bb: 466.16,
  B: 493.88
}

export class MonoSynth {
  context: AudioContext;
  osc: OscillatorNode;
  output: GainNode;
  filter: BiquadFilterNode;
  attackTime: number;
  releaseTime: number;
  portamentoTime: number;
  noteLength: number;
  release: NodeJS.Timeout | null;
  attack: NodeJS.Timeout | null;
  isPlaying: boolean;
  shouldPlayNextLoop: boolean;
  constructor(context: AudioContext,type: OscillatorType) {
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
    this.releaseTime = 0.01;
    this.portamentoTime = 0;
    this.noteLength = 0.5;
    this.attack = null;
    this.release = null;
    this.isPlaying = true;
    this.shouldPlayNextLoop = true;
  }

  pattern: (0|1)[][] = [
    [1,0,0,0,0,0],
    [0,1,0,0,0,0],
    [0,0,1,0,0,0],
    [0,0,0,1,0,0],
    [0,0,0,0,1,0],
    [0,0,0,0,0,1],
    [0,0,0,0,1,0],
    [0,0,0,1,0,0],
    [0,0,1,0,0,0],
    [0,1,0,0,0,0],
    [1,0,0,0,0,0],
    [0,1,0,0,0,0],
    [0,0,1,0,0,0],
    [0,0,0,1,0,0],
    [0,0,0,0,1,0],
    [0,0,0,0,0,1],
  ]
  scale: number[] = [
    notes['D'],
    notes['F'],
    notes['G'],
    notes['A'],
    notes['C'] * 2,
    notes['D'] * 2,
  ]
  octave: number = 1/4;
  updatePattern = (value: 0|1, beat: number, note: number): void => {
    this.pattern[beat][note] = value;
    // only one note per column permitted
    if(value === 1) {
      this.pattern[beat].forEach((_,i) => {
        if(i !== note) {
          this.pattern[beat][i] = 0;
        }
      })
    }
  }

  playNote(note: number, time: number, tempo: number): void{
    const delay = (time - this.context.currentTime) * 1000;
    if(this.attack) clearTimeout(this.attack);
    if(this.release) clearTimeout(this.release);
    // set frequency
    this.osc.frequency.setValueAtTime(note, time)
    this.attack = setTimeout(() => {
      // cancel release of last note
      this.output.gain.cancelScheduledValues(this.context.currentTime);
      // set turn up the volume with attackTime
      this.output.gain.setTargetAtTime(0.4, this.context.currentTime, this.attackTime / 4);
      // stop note at note length
      this.release = setTimeout(() => {
        this.stopNote();
      }, ((60 / (tempo*2)) * 1000) * this.noteLength)
    }, delay)
  }
  
  stopNote(): void {
    // turn down the volume with releaseTime
    this.output.gain.cancelScheduledValues(this.context.currentTime);
    this.output.gain.setTargetAtTime(0, this.context.currentTime, this.releaseTime / 4)
  }
}