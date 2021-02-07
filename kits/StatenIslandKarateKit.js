const { Set, Steprow } = require('../server/db/models');

const statenIslandKarateKit = async () => {
  const set = await Set.create({
    name: 'Staten Island Karate Kit',
    tempo: 90,
  });
  await Steprow.create({
    name: 'Bass 1',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F01%20Bass%201.mp3?alt=media&token=8d1e840e-86b6-48bd-9cd8-886d38c9965c',
    pattern: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Bass 2',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F02%20Bass%202.mp3?alt=media&token=f92874e1-1b79-4c2d-ae12-8dfa7bf17145',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Guitar',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F03%20Guitar.mp3?alt=media&token=a7087c9a-5953-472c-aa95-f4c07c7864c2',
    pattern: [0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Bubble FX',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F04%20Bubble%20FX.mp3?alt=media&token=248cf5e4-3ad4-412c-a9cf-3f6d7a7b4160',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Tom Mid',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F05%20Tom%20Mid.mp3?alt=media&token=4ab6852f-05cf-41c5-8dcd-08f9b60e57f1',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Tom Low',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F06%20Tom%20Low.mp3?alt=media&token=2e39812d-918d-4115-ad23-fb4898c87389',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Chant 1',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F07%20Chant%201.mp3?alt=media&token=092c41ee-8841-4b7a-9421-d466c36c6a75',
    pattern: [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Chant 2',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F08%20Chant%202.mp3?alt=media&token=ce3912f7-24eb-4bde-8815-cbe707ecb952',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Tom Hi',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F09%20Tom%20Hi.mp3?alt=media&token=d1defe23-9c02-4de3-abfd-06e018de1ec6',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Sleigh Bells',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F10%20Sleigh%20Bells.mp3?alt=media&token=06672a88-1598-4a30-8fcf-e47cc8527050',
    pattern: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Hat Closed',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F11%20Hat%20Closed.mp3?alt=media&token=0bc99051-9cef-46b8-ba2f-477eb4522340',
    pattern: [1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Hat Open',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F12%20Hat%20Open.mp3?alt=media&token=553c7c2d-4d9d-4bdc-b98f-fdc5b7f7147c',
    pattern: [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Kick',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F13%20Kick.mp3?alt=media&token=827cb814-968d-4469-9aee-a903d8b00d91',
    pattern: [1,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Rim',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F14%20Rim.mp3?alt=media&token=f827941b-9cf2-4800-8c7d-ada44cc57e81',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Snare',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F15%20Snare.mp3?alt=media&token=ba79bdac-8775-43ac-9318-d5a788a53f68',
    pattern: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Clap',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Staten%20Island%20Karate%20Kit%2F16%20Clap.mp3?alt=media&token=15e99306-8310-462d-81e3-3861757a169e',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
}

module.exports = statenIslandKarateKit;