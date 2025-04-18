const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    title: { type: DataTypes.STRING(100) },
    content: { type: DataTypes.TEXT },
    document: { type: DataTypes.STRING(255) },
    trainingId: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT },
    categoryId: { type: DataTypes.INTEGER },
  }, { 
    ...timestamps,
    hooks: {
      afterCreate: async (course) => {
        if (course.categoryId) {
          await sequelize.models.Category.increment('courseCount', {
            by: 1,
            where: { id: course.categoryId }
          });
        }
      },
      afterDestroy: async (course) => {
        if (course.categoryId) {
          await sequelize.models.Category.decrement('courseCount', {
            by: 1,
            where: { id: course.categoryId }
          });
        }
      },
      afterUpdate: async (course) => {
        if (course.changed('categoryId')) {
          // Decrement old category
          if (course.previous('categoryId')) {
            await sequelize.models.Category.decrement('courseCount', {
              by: 1,
              where: { id: course.previous('categoryId') }
            });
          }
          // Increment new category
          if (course.categoryId) {
            await sequelize.models.Category.increment('courseCount', {
              by: 1,
              where: { id: course.categoryId }
            });
          }
        }
      }
    }
  });

  Course.associate = (models) => {
    Course.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
  };

  return Course;
};
