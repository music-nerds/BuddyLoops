const { Set, Steprow } = require('../server/db/models');

const statenIslandKarateKit = async () => {
  const set = await Set.create({
    name: 'Staten Island Karate Kit',
    tempo: 90,
  });
  await Steprow.create({
    name: 'Bass 1',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/01+Bass+1.mp3',
    pattern: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Bass 2',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/02+Bass+2.mp3',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Guitar',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/03+Guitar.mp3',
    pattern: [0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Bubble FX',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/04+Bubble+FX.mp3',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Tom Mid',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/05+Tom+Mid.mp3',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Tom Low',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/06+Tom+Low.mp3',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Chant 1',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/07+Chant+1.mp3',
    pattern: [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Chant 2',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/08+Chant+2.mp3',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Tom Hi',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/09+Tom+Hi.mp3',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Sleigh Bells',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/10+Sleigh+Bells.mp3',
    pattern: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Hat Closed',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/11+Hat+Closed.mp3',
    pattern: [1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Hat Open',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/12+Hat+Open.mp3',
    pattern: [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Kick',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/13+Kick.mp3',
    pattern: [1,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Rim',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/14+Rim.mp3',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Snare',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/15+Snare.mp3',
    pattern: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Clap',
    audioPath: 'https://buddyloopskits.s3.us-east-2.amazonaws.com/Staten+Island+Karate+Kit/16+Clap.mp3',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });

}

module.exports = statenIslandKarateKit;