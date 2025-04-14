const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    title: { type: DataTypes.STRING(100) },
    content: { type: DataTypes.TEXT },
    document: { type: DataTypes.STRING(255) },
    trainingId: { type: DataTypes.INTEGER }
  }, { ...timestamps });

  return Course;
};
