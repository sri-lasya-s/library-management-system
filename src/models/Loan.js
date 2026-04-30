const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Member = require('./Member');
const Book = require('./Book');

const Loan = sequelize.define('Loan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  loan_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  due_date: { type: DataTypes.DATEONLY, allowNull: false },
  return_date: { type: DataTypes.DATEONLY },
  status: {
    type: DataTypes.ENUM('active', 'returned', 'overdue', 'cancelled'),
    defaultValue: 'active',
  },
}, { 
  tableName: 'loans', 
  timestamps: true,
  indexes: [
    { fields: ['member_id'] },
    { fields: ['book_id'] },
    { fields: ['status'] }
  ]
});

Loan.belongsTo(Member, { foreignKey: 'member_id' });
Loan.belongsTo(Book, { foreignKey: 'book_id' });
Member.hasMany(Loan, { foreignKey: 'member_id' });
Book.hasMany(Loan, { foreignKey: 'book_id' });

module.exports = Loan;