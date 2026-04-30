const { Book } = require('../models');

exports.getAllBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Book.findAndCountAll({
      limit: parseInt(limit), offset: parseInt(offset)
    });
    res.json({ total: count, page: parseInt(page), totalPages: Math.ceil(count / limit), data: rows });
  } catch (err) { next(err); }
};

exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) { next(err); }
};

exports.createBook = async (req, res, next) => {
  try {
    const { isbn, title, author, genre, total_copies } = req.body;
    if (!isbn || !title || !author) return res.status(400).json({ error: 'isbn, title, and author are required' });
    const book = await Book.create({ isbn, title, author, genre, total_copies, available_copies: total_copies });
    res.status(201).json(book);
  } catch (err) { next(err); }
};

exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    const { title, author, genre, total_copies, available_copies } = req.body;
    await book.update({ title, author, genre, total_copies, available_copies });
    res.json(book);
  } catch (err) { next(err); }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    await book.destroy();
    res.json({ message: 'Book deleted successfully' });
  } catch (err) { next(err); }
};