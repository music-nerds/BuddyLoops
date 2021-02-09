const Set = require('./set');
const Steprow = require('./stepRow');

Steprow.belongsTo(Set);
Set.hasMany(Steprow);

module.exports = {
  Set,
  Steprow,
}