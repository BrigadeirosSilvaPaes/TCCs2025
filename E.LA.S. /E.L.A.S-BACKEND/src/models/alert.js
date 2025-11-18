const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Alert = sequelize.define('Alert', {
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
    }
  },
  tipo_alerta: {
    type: DataTypes.ENUM('emergencia', 'sos', 'perigo'),
    defaultValue: 'sos'
  },
  numero_medida: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  mensagem: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  status: {
    type: DataTypes.ENUM('ativo', 'cancelado', 'resolvido'),
    defaultValue: 'ativo'
  },
  resolvido_em: {
    type: DataTypes.DATE,
    allowNull: true
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'alerts',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: false
});

// Associações
Alert.associate = function(models) {
  Alert.belongsTo(models.User, { foreignKey: 'usuario_id', as: 'usuario' });
};

module.exports = Alert;