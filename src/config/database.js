const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.NODE_ENV === 'production' ? '/home/library.sqlite' : './library.sqlite',
  logging: false,
  dialectOptions: {
    mode: null
  }
});

module.exports = sequelize;