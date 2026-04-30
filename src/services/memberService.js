const { Member, Loan, Book } = require('../models');

exports.getMemberWithLoans = async (memberId) => {
  try {
    const member = await Member.findByPk(memberId, {
      include: [{
        model: Loan,
        include: [{ model: Book }]
      }]
    });
    if (!member) return { error: 'Member not found' };
    return member;
  } catch (error) {
    return { error: 'Failed to fetch member', details: error.message };
  }
};