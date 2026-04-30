const sequelize = require('../config/database');
const Member = require('./Member');
const Book = require('./Book');
const Loan = require('./Loan');

module.exports = { sequelize, Member, Book, Loan };