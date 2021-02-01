const db = require('../db');
const { UUID, UUIDV4, INTEGER, STRING } = require('sequelize');

const Set = db.define('set', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  tempo: {
    type: INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 50,
      max: 180,
    },
  },
  swing: {
    type: INTEGER,
    defaultValue: 0,
  },
});

module.exports = Set;
