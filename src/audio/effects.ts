export class AnalogDelay {
  context: AudioContext;
  delay: DelayNode;
  feedback: GainNode;
  filter: BiquadFilterNode;
  hp: BiquadFilterNode;
  input: GainNode;
  output: GainNode;
  constructor(context: AudioContext, delayTime = 0.36) {
    this.context = context;
    this.delay = this.context.createDelay();
    this.delay.delayTime.setValueAtTime(delayTime, this.context.currentTime);
    this.feedback = context.createGain();
    this.feedback.gain.value = 0.3;
    this.filter = context.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 2500;
    this.hp = context.createBiquadFilter();
    this.hp.type = "highpass";
    this.hp.frequency.value = 250;
    this.input = this.context.createGain();
    this.output = this.context.createGain();
    this.output.gain.value = 0.25;

    // wet signal
    this.input.connect(this.filter);
    this.filter.connect(this.hp);
    this.hp.connect(this.delay);
    this.delay.connect(this.feedback);
    this.feedback.connect(this.filter);
    this.delay.connect(this.output);
    // output
    this.output.connect(this.context.destination);
  }
  setDelayTime(time: number) {
    this.delay.delayTime.setValueAtTime(time, this.context.currentTime);
  }
}
