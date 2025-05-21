const { DataTypes } = require('sequelize');
const timestamps = require('./Timestamps');

module.exports = (sequelize) => {
  const Formation = sequelize.define('Formation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    title: { type: DataTypes.STRING(100) },
    description: { type: DataTypes.TEXT },
    location: { type: DataTypes.STRING(255) },
    date: { type: DataTypes.STRING(255) },
    // categoryId: { type: DataTypes.INTEGER },
    // professorId: { type: DataTypes.INTEGER, allowNull: false },
    // lessonCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    thumbnail: { type: DataTypes.STRING(255) },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    price: { 
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    }
  },{
    timestamps: true
  });

  // Formation.associate = (models) => {
  //   // Formation.belongsTo(models.Category, {
  //   //   foreignKey: 'categoryId',
  //   //   as: 'category'
  //   // });
    
  //   // Formation.belongsTo(models.User, {
  //   //   foreignKey: 'professorId',
  //   //   as: 'professor'
  //   // });

  //   Formation.hasMany(models.Lesson, {
  //     foreignKey: 'formationId',
  //     as: 'lessons'
  //   });
  // };

  return Formation;
}; 