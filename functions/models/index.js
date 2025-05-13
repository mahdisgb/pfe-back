'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const db = {};

let sequelize;
sequelize = new Sequelize(process.env.DB_PROD_CONNECTION);
// sequelize = new Sequelize("");
// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
  fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file !== 'AssociateModels.js' && file !== 'Timestamps.js' && file.endsWith('.js'))
  .forEach(file => {
    const filePath = path.join(__dirname, file)
    const model = require(filePath)(sequelize);
    db[model.name] = model;
  });
  // ["../models/ItemModel.js", "../models/UserModel.js"]
  // require('./AssociateModels.js')(db);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
