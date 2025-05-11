const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://mysql:password1@localhost:3306/inventory_management') 

module.exports = sequelize

