const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const MinorStudent = sequelize.define('MinorStudent', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    studentId: { type: DataTypes.INTEGER, allowNull: false },
    parentEmail: { type: DataTypes.STRING(100) },
    parentApproved: { type: DataTypes.BOOLEAN },
  }, { ...timestamps });

  return MinorStudent;
};
