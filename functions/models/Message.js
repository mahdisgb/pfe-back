const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const Message = sequelize.define("Message", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roomId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
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
    ...timestamps,
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Message;
}; 