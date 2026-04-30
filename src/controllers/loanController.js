const { Loan, Member, Book } = require('../models');

exports.getLoansByMember = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const member = await Member.findByPk(memberId);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    const { count, rows } = await Loan.findAndCountAll({
      where: { member_id: memberId },
      include: [{ model: Book }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['loan_date', 'DESC']],
    });
    res.json({ total: count, page: parseInt(page), totalPages: Math.ceil(count / limit), data: rows });
  } catch (err) { next(err); }
};

exports.getLoanById = async (req, res, next) => {
  try {
    const loan = await Loan.findByPk(req.params.loanId, {
      include: [{ model: Member }, { model: Book }],
    });
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    res.json(loan);
  } catch (err) { next(err); }
};

exports.createLoan = async (req, res, next) => {
  try {
    const { member_id, book_id, due_date } = req.body;
    if (!member_id || !book_id || !due_date)
      return res.status(400).json({ error: 'member_id, book_id, and due_date are required' });
    const member = await Member.findByPk(member_id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    const book = await Book.findByPk(book_id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (book.available_copies < 1)
      return res.status(400).json({ error: 'No copies available' });
    const loan = await Loan.create({ member_id, book_id, due_date, loan_date: new Date() });
    await book.update({ available_copies: book.available_copies - 1 });
    res.status(201).json(loan);
  } catch (err) { next(err); }
};

exports.updateLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findByPk(req.params.loanId);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    const { due_date, status, return_date } = req.body;
    if (status === 'returned' && loan.status !== 'returned') {
      const book = await Book.findByPk(loan.book_id);
      await book.update({ available_copies: book.available_copies + 1 });
    }
    await loan.update({ due_date, status, return_date });
    res.json(loan);
  } catch (err) { next(err); }
};

exports.deleteLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findByPk(req.params.loanId);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    if (loan.status === 'active') {
      const book = await Book.findByPk(loan.book_id);
      await book.update({ available_copies: book.available_copies + 1 });
    }
    await loan.update({ status: 'cancelled' });
    res.json({ message: 'Loan cancelled successfully' });
  } catch (err) { next(err); }
};