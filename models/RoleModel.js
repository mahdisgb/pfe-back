const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
     const Role = sequelize.define("Role", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        name: { type: DataTypes.STRING },
    }, {
        timestamps: false,
    });
    Role.associate = (models) => {
        Role.belongsToMany(models.User, {
          through: 'UserRoles', // This is the join table
          foreignKey: 'roleId',
          otherKey: 'userId',
        });
      };
    return Role
};
