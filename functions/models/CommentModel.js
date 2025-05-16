const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Comment = sequelize.define("Comment", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Lessons',
        key: 'id'
      }
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timeAdded: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: true
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Comment.belongsTo(models.Lesson, {
      foreignKey: 'lessonId',
      as: 'lesson'
    });
    Comment.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
  };

  return Comment;
}; 