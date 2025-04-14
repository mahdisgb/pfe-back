const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    studentId: { type: DataTypes.INTEGER },
    amount: { type: DataTypes.FLOAT },
    paymentMethod: { type: DataTypes.STRING(50) },
    paymentDate: { type: DataTypes.DATE },
  }, { ...timestamps });

  return Payment;
};
