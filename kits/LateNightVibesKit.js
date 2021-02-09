const { Set, Steprow } = require('../server/db/models');

const lateNightVibesKit = async () => {
  const set = await Set.create({
    name: 'Late Night Vibes Kit',
    tempo: 90,
  });
  await Steprow.create({
    name: 'Vox 1',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F01_Vox1.wav?alt=media&token=d003c2fe-b49f-4d87-914d-11e1eca1404a',
    pattern: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Vox 2',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F02_Vox2.wav?alt=media&token=242993e3-c72c-4e20-80a3-17162688e4bf',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Vox 3',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F03_Vox3.wav?alt=media&token=aa712d08-eafd-471e-bf27-dbce6f7ea090',
    pattern: [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'PluckHi',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F04_PluckHi.wav?alt=media&token=c86e4206-0c20-4118-83f5-a33ce419823d',
    pattern: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'BassHi',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F05_BassHi.wav?alt=media&token=aad07ff1-d810-408f-bc2a-7843a89ef7db',
    pattern: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'BassLo',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F06_BassLo.wav?alt=media&token=ddbc4b38-dae4-4666-b542-35e1c1336757',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Pad',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F07_Pad.wav?alt=media&token=9fcf1de9-19a4-4038-89f0-7e0c3364670e',
    pattern: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'PluckLo',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F08_PluckLo.wav?alt=media&token=3e90aab6-a2aa-4d17-bd96-93110610fed8',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Perc1',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F09_Perc1.wav?alt=media&token=c82f69be-fc5e-40c3-a261-270bca34652e',
    pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Perc2',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F10_Perc2.wav?alt=media&token=ec690d67-29cb-4d76-8580-b11075e7ff58',
    pattern: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Clap',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F11_Clap.wav?alt=media&token=04012cf3-0fc6-4f5c-abbd-b0f643b6a65b',
    pattern: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Snap',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F12_Snap.wav?alt=media&token=cd989af7-be4e-439c-b41a-dc91f129753a',
    pattern: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Kick',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F13_Kick.wav?alt=media&token=3230d5c0-5e44-4f79-96fb-d9af698f6e58',
    pattern: [1,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Snare',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F14_Snare.wav?alt=media&token=6280c864-a836-4415-ae30-cc8b9745b654',
    pattern: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'ClosedHH',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F15_HH.wav?alt=media&token=23df5af1-2881-44c4-b0fc-9e4e4ff2f7c9',
    pattern: [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'OpenHH',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Late%20Nite%20Vibes%20Kit%2F16_OpenHH.wav?alt=media&token=5a8d46d8-9384-496b-aa07-3cca399b270b',
    pattern: [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    setId: set.id,
  });
}

module.exports = lateNightVibesKit;