const router = require('express').Router();
const { Set, Steprow } = require('../db/models');

router.get('/getkits', async (req, res) => {
  try {
    const sets = await Set.findAll({ include: [Steprow] });
    res.send(sets);
  } catch (e) {
    res.sendStatus(404);
    console.error(e);
    throw e;
  }
});

module.exports = router;
