const { Set, Steprow } = require('../server/db/models');

const defaultKit = async () => {
  const set = await Set.create({
    name: 'Matt Kilmer Kit',
    tempo: 125,
  });
  await Steprow.create({
    name: 'Jungle Kick',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/01_JungleKick.wav',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Jungle Snare',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/02_JUNGLESNARE1.wav',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Clave 1',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/03_Clave1.wav',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Cymbal',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/04_Cymbal.wav',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Hi Tom',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/05_HiTom.wav',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Snare Dry 1',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/06_SnareDry3.wav',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Clave 2',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/07_Clave2.wav',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Click Clap',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/08_ClickClap.wav',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Kick 2',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/09_KICK2+DRY.wav',
    pattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Snare Verb',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/10_SnareVerb1.wav',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Clap',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/11_Clap1.wav',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Sizzle Hat',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/12_SizzleHat.wav',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Kick 1',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/13_Kick1.wav',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Snare Dry 2',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/14_SnareDry4.wav',
    pattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Click',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/15_Click1.wav',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Hi Hat Dry',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Default+Kit/16_HHDry1.wav',
    pattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    setId: set.id,
  });
};

module.exports = defaultKit;
