import { StepContext, StepRow } from "./createContext";

export const playback = (ctx: StepContext, seq: StepRow): void => {
  const playSound = ctx.context.createBufferSource();
  playSound.buffer = seq.audioBuffer;
  playSound.connect(seq.gain);
  playSound.start(ctx.nextNoteTime);
};

export const audition = (ctx: StepContext, seq: StepRow): void => {
  const playSound = ctx.context.createBufferSource();
  playSound.buffer = seq.audioBuffer;
  playSound.connect(seq.gain);
  playSound.start();
};

export const nextNote = (ctx: StepContext): void => {
  const secondsPerBeat: number = 60 / (ctx.tempo * 4);
  const maxSwing: number = secondsPerBeat / 3;
  const swingPercent: number = ctx.swing / 100;
  const swing = swingPercent * maxSwing;

  if (ctx.currentNote % 2 === 0) {
    ctx.nextNoteTime += secondsPerBeat + swing;
  } else {
    ctx.nextNoteTime += secondsPerBeat - swing;
  }
  ctx.currentNote++;
  if (ctx.currentNote === 16) {
    ctx.currentNote = 0;
  }
};

export const calculateFullCycleTime = (ctx: StepContext) => {
  return Math.floor(ctx.nextNoteTime + (60000 / (ctx.tempo * 2)) * 16);
};

export const calculateNextCycleTime = (ctx: StepContext) => {
  return Date.now() + calculateFullCycleTime(ctx);
};

export const scheduleNote = (ctx: StepContext, beatNumber: number): void => {
  // handle which loops should play each cycle
  const quantizeLength = 16;
  if (beatNumber % quantizeLength === 0) {
    if (ctx.sequencersShouldPlayNextLoop) {
      ctx.sequencersArePlaying = true;
    } else {
      ctx.sequencersArePlaying = false;
    }
    ctx.sequencers.forEach((seq) => {
      if (seq.shouldPlayNextLoop) {
        seq.isPlaying = true;
      } else {
        seq.isPlaying = false;
      }
    });
  }
  // play the samples
  if (ctx.sequencersArePlaying) {
    ctx.sequencers.forEach((seq, idx) => {
      // if (seq.squares && seq.squares[beatNumber].getAttribute('aria-checked') === 'true' && seq.isPlaying && seq.audioBuffer) {
      if (ctx.audition[idx] || (seq.pattern[beatNumber] && seq.isPlaying && seq.audioBuffer)) {
        playback(ctx, seq);
      }
    }); 
  } else {
    ctx.sequencers.forEach((seq, idx) => {
      if (ctx.audition[idx]) {
        playback(ctx, seq);
      }
    }); 
  }
  const hasNote = ctx.synth.pattern[beatNumber].includes(1);
  if (hasNote) {
    ctx.synth.pattern[beatNumber].forEach((note, i) => {
      if (note === 1) {
        ctx.synth.playNote(
          ctx.synth.scale[i] * ctx.synth.octave,
          ctx.nextNoteTime,
          ctx.tempo
        );
      }
    });
  } else {
    ctx.synth.stopNote();
  }
  // paint the dom
  ctx.subscribers.forEach((fn) => {
    fn(beatNumber);
  });
  if (beatNumber === 0) {
    // next note time plus 16 beats converted to ms
    ctx.nextCycleTime = calculateNextCycleTime(ctx);
  }
};

export const scheduler = (ctx: StepContext): void => {
  while (ctx.nextNoteTime < ctx.context.currentTime + ctx.scheduleAheadTime) {
    scheduleNote(ctx, ctx.currentNote);
    nextNote(ctx);
  }
  ctx.timerId = window.setTimeout(() => scheduler(ctx), ctx.lookAhead);
};

export const play = (ctx: StepContext): void => {
  if (!ctx.isPlaying) {
    ctx.isPlaying = true;
    ctx.currentNote = 0;
    ctx.nextNoteTime = ctx.context.currentTime + ctx.scheduleAheadTime;
    scheduler(ctx);
  }
};

export const stop = (ctx: StepContext): void => {
  if (ctx.isPlaying) {
    ctx.isPlaying = false;
    window.clearTimeout(ctx.timerId);
  }
  ctx.synth.stopNote();
};
