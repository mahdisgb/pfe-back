const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const Invoice = sequelize.define('Invoice', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    invoiceNumber: { type: DataTypes.STRING(100) },
    paymentId: { type: DataTypes.INTEGER },
  }, { ...timestamps });

  return Invoice;
};
