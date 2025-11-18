const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Config = sequelize.define('Config', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    unique: true
  },
  notificacoes: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  modo_escuro: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  idioma: {
    type: DataTypes.STRING,
    defaultValue: 'pt-BR'
  },
  compartilhar_localizacao: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'configs',
  timestamps: true
});

// Associação
Config.associate = function(models) {
  Config.belongsTo(models.User, { foreignKey: 'usuario_id' });
};

module.exports = Config;