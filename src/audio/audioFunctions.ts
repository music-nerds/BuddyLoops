import { StepContext } from './createContext';

export const playback = (ctx: StepContext, sound: AudioBuffer): void => {
  const playSound = ctx.context.createBufferSource();
  playSound.buffer = sound;
  playSound.connect(ctx.destination);
  playSound.start(ctx.nextNoteTime);
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
  // handle which loops should play each cycle
  if (beatNumber === 0) {
    ctx.sequencers.forEach(seq => {
      if(seq.shouldPlayNextLoop){
        seq.isPlaying = true;
      } else {
        seq.isPlaying = false;
      }
    })
  }
  // play the samples
  ctx.sequencers.forEach(seq => {
      if (seq.squares && seq.squares[beatNumber].getAttribute('aria-checked') === 'true' && seq.isPlaying && seq.audioBuffer) {
        playback(ctx, seq.audioBuffer);
      }
    })
  // paint the dom  
  ctx.subscribers.forEach(fn => fn(beatNumber));
};

export const scheduler = (ctx: StepContext): void => {
  while (ctx.nextNoteTime < ctx.context.currentTime + ctx.scheduleAheadTime) {
    scheduleNote(ctx, ctx.currentNote);
    nextNote(ctx);
  }
  ctx.timerId = window.setTimeout(() => scheduler(ctx), ctx.lookAhead);
};

export const play = (ctx: StepContext): void => {
  if(ctx.context.state !== 'running'){
    ctx.context.resume();
  }
  if (!ctx.isPlaying) {
    ctx.isPlaying = true;
    ctx.currentNote = 0;
    ctx.nextNoteTime = ctx.context.currentTime;
    scheduler(ctx);
  }
};

export const stop = (ctx: StepContext): void => {
  if(ctx.isPlaying) {
    ctx.isPlaying = false;
    window.clearTimeout(ctx.timerId);
  }
}
