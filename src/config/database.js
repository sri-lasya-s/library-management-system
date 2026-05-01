const { Sequelize } = require('sequelize');
require('dotenv').config();

const Database = require('better-sqlite3');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  dialectModule: Database,
  storage: '/home/library.sqlite',
  logging: false,
});

module.exports = sequelize;