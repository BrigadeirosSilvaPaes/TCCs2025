const User = require('./User');
const Config = require('/Config');
const Alert = require('/Alert');

// Configurar associações
User.hasOne(Config, { foreignKey: 'usuario_id' });
User.hasMany(Alert, { foreignKey: 'usuario_id' });

module.exports = {
  User,
  Config,
  Alert
};