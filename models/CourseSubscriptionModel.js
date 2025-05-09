const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const CourseSubscription = sequelize.define('CourseSubscription', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    status: { 
      type: DataTypes.ENUM('active', 'expired'),
      defaultValue: 'active'
    },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    paymentMethod: { type: DataTypes.STRING(50) },
    lastPaymentDate: { type: DataTypes.DATE },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
  }, { ...timestamps });

  CourseSubscription.associate = (models) => {
    CourseSubscription.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    CourseSubscription.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
  };

  return CourseSubscription;
}; 