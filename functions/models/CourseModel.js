const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    title: { type: DataTypes.STRING(100) },
    description: { type: DataTypes.TEXT },
    categoryId: { type: DataTypes.INTEGER },
    professorId: { type: DataTypes.INTEGER, allowNull: false },
    lessonCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    thumbnail: { type: DataTypes.STRING(255) },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    price: { 
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    }
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
    
    Course.belongsTo(models.User, {
      foreignKey: 'professorId',
      as: 'professor'
    });

    Course.hasMany(models.Lesson, {
      foreignKey: 'courseId',
      as: 'lessons'
    });
  };

  return Course;
};
