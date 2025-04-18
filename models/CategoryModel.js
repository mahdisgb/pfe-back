const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    courseCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  }, { ...timestamps });

  Category.associate = (models) => {
    Category.hasMany(models.Course, {
      foreignKey: 'categoryId',
      as: 'courses'
    });
  };
  return Category;
};
