const { Set, Steprow } = require('../server/db/models');

const defaultKit = async () => {
  const set = await Set.create({
    name: 'Matt Kilmer Kit',
    tempo: 125,
    synthPattern: [
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
    ],
  });
  await Steprow.create({
    name: 'Jungle Kick',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F1_JungleKick.wav?alt=media&token=c31db239-edeb-4d95-9cfd-a91b69c9dcea',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Jungle Snare',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F2_JUNGLESNARE1.wav?alt=media&token=359805cb-1626-4dd1-86b4-e95dbfd1c611',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Clave 1',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F3_Clave1.wav?alt=media&token=a061b2e7-de18-4306-92d5-aae388365ad7',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Cymbal',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F4_Cymbal.wav?alt=media&token=bc9383d2-1f28-402a-b376-db643f247fe2',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Hi Tom',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F5_HiTom.wav?alt=media&token=54474f3a-95c6-4f4f-a5a3-845fe5e56481',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Snare Dry 1',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F6_SnareDry3.wav?alt=media&token=b57812b8-adf1-4b83-b6e1-5fdd7edd8986',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Clave 2',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F7_Clave2.wav?alt=media&token=b09d10c0-9ca4-49b0-b3d8-12e4ea3983bb',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Click Clap',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F8_ClickClap.wav?alt=media&token=0877ae76-bfa8-4edf-9f0d-207098316528',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Kick 2',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F9_KICK2%20DRY.wav?alt=media&token=b1fdeb67-e743-4381-a3c8-854797fce423',
    pattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Snare Verb',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F10_SnareVerb1.wav?alt=media&token=95d69ea0-51ba-4685-b580-aa9954f80b64',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Clap',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F11_Clap1.wav?alt=media&token=36f6f2d0-cb00-4c24-8bd5-2baccbbcfa72',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Sizzle Hat',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F12_SizzleHat.wav?alt=media&token=0f667927-edf5-4386-b408-d7034d4eee7f',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Kick 1',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F13_Kick1.wav?alt=media&token=d344820b-5ca8-4392-94e4-bc2c39007a98',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Snare Dry 2',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F14_SnareDry4.wav?alt=media&token=c8f43fa2-2a2b-41f1-b4d0-323d0e460057',
    pattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Click',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F15_Click1.wav?alt=media&token=4e0a24ef-ac4a-4929-93f1-2ee1642cea7a',
    pattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    setId: set.id,
  });
  await Steprow.create({
    name: 'Hi Hat Dry',
    audioPath: 'https://firebasestorage.googleapis.com/v0/b/buddyloops-fd8dc.appspot.com/o/Kilmer%20Kit%2F16_HHDry1.wav?alt=media&token=c41f8d14-125c-4d88-a557-6cf7979b92a3',
    pattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    setId: set.id,
  });
};

module.exports = defaultKit;
