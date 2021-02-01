const db = require('../db');
const { STRING, ARRAY, INTEGER, UUID, UUIDV4 } = require('sequelize');

const StepRow = db.define('steprow', {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  audioPath: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  pattern: {
    type: ARRAY(INTEGER),
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
});

module.exports = StepRow;
