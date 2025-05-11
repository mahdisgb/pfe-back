const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const LocalTraining = sequelize.define('LocalTraining', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    trainingId: { type: DataTypes.INTEGER, allowNull: false },
    location: { type: DataTypes.STRING(100) },
  }, { ...timestamps });

  return LocalTraining;
};
