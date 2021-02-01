const Set = require('./set');
const StepRow = require('./stepRow');

StepRow.belongsTo(Set);
Set.hasMany(StepRow);

module.exports = {
  Set,
  StepRow,
}