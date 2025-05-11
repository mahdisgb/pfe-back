const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const Card = sequelize.define('Card', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    cardCode: { type: DataTypes.INTEGER },
    validationDate: { type: DataTypes.DATE },
    lastName: { type: DataTypes.STRING(50) },
    firstName: { type: DataTypes.STRING(50) },
  }, { ...timestamps });

  return Card;
};
