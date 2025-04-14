const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const Training = sequelize.define('Training', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    title: { type: DataTypes.STRING(100) },
    description: { type: DataTypes.TEXT },
    type: { type: DataTypes.STRING(50) },
    category: { type: DataTypes.STRING(50) },
    price: { type: DataTypes.FLOAT },
    professorId: { type: DataTypes.INTEGER },
  }, { ...timestamps });

  return Training;
};
