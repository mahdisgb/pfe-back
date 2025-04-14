const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    authorId: { type: DataTypes.INTEGER }, // FK to Student
    trainingId: { type: DataTypes.INTEGER },
    content: { type: DataTypes.TEXT },
  }, { ...timestamps });

  return Comment;
};
