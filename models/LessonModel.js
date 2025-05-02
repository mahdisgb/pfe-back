const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const Lesson = sequelize.define('Lesson', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    title: { type: DataTypes.STRING(100), allowNull: false },
    content: { type: DataTypes.TEXT },
    document: { type: DataTypes.STRING(255) },
    courseId: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT, allowNull: false },
    order: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: false },
    videoUrl: { type: DataTypes.STRING(255), allowNull: false },
    videoBlob: { type: DataTypes.BLOB },
    thumbnailUrl: { type: DataTypes.STRING(255) },
    views: { type: DataTypes.INTEGER, defaultValue: 0 },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
    professorId: { type: DataTypes.INTEGER, allowNull: false },
    // tags: { type: DataTypes.ARRAY(DataTypes.STRING) },
    difficulty: { type: DataTypes.STRING(255)},
    status: {type: DataTypes.STRING(255)},
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
    completionRate: { type: DataTypes.FLOAT, defaultValue: 0 },
    averageRating: { type: DataTypes.FLOAT, defaultValue: 0 },
    totalRatings: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, { 
    ...timestamps,
    hooks: {
      beforeCreate: async (lesson) => {
        if (lesson.courseId) {
          const course = await sequelize.models.Course.findByPk(lesson.courseId);
          if (course) {
            lesson.professorId = course.professorId;
          }
        }
      },
      afterCreate: async (lesson) => {
        if (lesson.courseId) {
          await sequelize.models.Course.increment('lessonCount', {
            by: 1,
            where: { id: lesson.courseId }
          });
        }
      },
      afterDestroy: async (lesson) => {
        if (lesson.courseId) {
          await sequelize.models.Course.decrement('lessonCount', {
            by: 1,
            where: { id: lesson.courseId }
          });
        }
      }
    }
  });

  Lesson.associate = (models) => {
    Lesson.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
    Lesson.belongsTo(models.User, {
      foreignKey: 'professorId',
      as: 'professor'
    });
  };

  return Lesson;
}; 