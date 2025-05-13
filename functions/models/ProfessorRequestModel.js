const { DataTypes } = require('sequelize');
const timestamps = require("./Timestamps");

module.exports = (sequelize) => {
    const ProfessorRequest = sequelize.define('ProfessorRequest', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        status: { 
            type: DataTypes.STRING(25),
            defaultValue: 'pending'
        },
        adminNotes: { type: DataTypes.TEXT }
    }, { ...timestamps });

    ProfessorRequest.associate = (models) => {
        ProfessorRequest.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return ProfessorRequest;
}; 