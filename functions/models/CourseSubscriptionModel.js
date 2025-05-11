const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const CourseSubscription = sequelize.define('CourseSubscription', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    status: { 
      type: DataTypes.STRING(10),
      defaultValue: 'active'
    },
    startDate: { type: DataTypes.DATE },
    endDate: { type: DataTypes.DATE },
    paymentMethod: { type: DataTypes.STRING(50) },
    lastPaymentDate: { type: DataTypes.DATE },
    // price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false },
    fullName: { type: DataTypes.STRING(100), allowNull: false },
    cardNumber: { type: DataTypes.STRING(20), allowNull: false },
    cardExpiry: { type: DataTypes.DATE, allowNull: false },
    cardCvv: { type: DataTypes.STRING(3), allowNull: false },
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