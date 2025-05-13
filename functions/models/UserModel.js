const { DataTypes } = require('sequelize');
const timestamps = require("./Timestamps")
module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        firstName: { type: DataTypes.STRING(25) },
        lastName: { type: DataTypes.STRING(25) },
        email: { type: DataTypes.STRING(50) },
        password: { type: DataTypes.STRING(75) },
        hashedPassword: { type: DataTypes.STRING(75) },
        status: { 
            type: DataTypes.STRING(25),
            defaultValue: 'active'
        }
      }, { ...timestamps },   {indexes:[{unique:true, fields: ['email']}]});
      
      User.associate = (models) => {
        User.belongsToMany(models.Role, {
          through: 'UserRoles', // This is the join table
          foreignKey: 'userId',
          otherKey: 'roleId',
        });
        User.hasMany(models.Course, {
          foreignKey: 'professorId',
          as: 'courses'
        });
      };
    
    return User;
};
