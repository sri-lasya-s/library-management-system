const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './library.sqlite',
  logging: false,
});

module.exports = sequelize;