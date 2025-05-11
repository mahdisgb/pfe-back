const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define("UserRoles", {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" }
      },
      roleId: {
        type: DataTypes.INTEGER,
        references: { model: "Roles", key: "id" }
      },
    }, {
      timestamps: false,
    });
  };
  