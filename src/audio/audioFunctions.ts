import { StepContext } from './createContext';

export const playback = (ctx: StepContext, sound: AudioBuffer, time: number): void => {
  const playSound = ctx.context.createBufferSource();
  playSound.buffer = sound;
  playSound.connect(ctx.destination);
  playSound.start(time);
};

export const nextNote = (ctx: StepContext): void => {
  const secondsPerBeat: number = (60 / ctx.tempo);

  ctx.nextNoteTime += secondsPerBeat;

  ctx.currentNote++;
  if (ctx.currentNote === 16) {
    ctx.currentNote = 0;
  };
};

export const scheduleNote = (ctx: StepContext, beatNumber: number): void => {

  if (beatNumber === 0) {
    ctx.sequencers.forEach(seq => {
      if(seq.shouldPlayNextLoop){
        seq.isPlaying = true;
      } else {
        seq.isPlaying = false;
      }
    })
  }
  ctx.sequencers.forEach(seq => {
      if (seq.squares && seq.squares[beatNumber].getAttribute('aria-checked') === 'true' && seq.isPlaying && seq.audioBuffer) {
        playback(ctx, seq.audioBuffer, ctx.nextNoteTime);
      }
  })
};

export const scheduler = (ctx: StepContext): void => {
  // console.log(ctx);
  while (ctx.nextNoteTime < ctx.context.currentTime + ctx.scheduleAheadTime) {
    scheduleNote(ctx, ctx.currentNote);
    nextNote(ctx);
  }
  ctx.timerId = window.setTimeout(() => scheduler(ctx), ctx.lookAhead);
};

export const play = (ctx: StepContext): void => {
  ctx.isPlaying = !ctx.isPlaying;
  if (ctx.isPlaying) {
    ctx.currentNote = 0;
    ctx.nextNoteTime = ctx.context.currentTime;
    scheduler(ctx);
  } else {
    window.clearTimeout(ctx.timerId);
  }
};
