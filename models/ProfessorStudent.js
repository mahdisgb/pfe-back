const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const Professor = sequelize.define('Professor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    specialty: { type: DataTypes.STRING(50) },
  }, { ...timestamps });

  return Professor;
};
