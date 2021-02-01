const db = require('./server/db/db');
const { statenIslandKarateKit } = require('./kits');

const seed = async () => {
  try {
    await db.sync({ force: true });
    await statenIslandKarateKit();
    console.log('Database Seeded');
  } catch (e) {
    console.error(e);
    throw e;
  }
};

seed();
