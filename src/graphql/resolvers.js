const { Member, Book, Loan } = require('../models');

const resolvers = {
  Query: {
    getMembers: async (_, { page = 1, limit = 10 }) => {
      const offset = (page - 1) * limit;
      const { count, rows } = await Member.findAndCountAll({
        limit, offset
      });
      return { total: count, page, totalPages: Math.ceil(count / limit), data: rows };
    },

    getMember: async (_, { id }) => {
      const member = await Member.findByPk(id, { include: [Loan] });
      if (!member) throw new Error('Member not found');
      return member;
    },

    getBooks: async (_, { page = 1, limit = 10 }) => {
      const offset = (page - 1) * limit;
      const { count, rows } = await Book.findAndCountAll({
        limit, offset
      });
      return { total: count, page, totalPages: Math.ceil(count / limit), data: rows };
    },

    getBook: async (_, { id }) => {
      const book = await Book.findByPk(id);
      if (!book) throw new Error('Book not found');
      return book;
    },

    getLoan: async (_, { loanId }) => {
      const loan = await Loan.findByPk(loanId, {
        include: [Member, Book]
      });
      if (!loan) throw new Error('Loan not found');
      return loan;
    },

    getLoansByMember: async (_, { memberId, page = 1, limit = 10 }) => {
      const offset = (page - 1) * limit;
      const member = await Member.findByPk(memberId);
      if (!member) throw new Error('Member not found');
      const { count, rows } = await Loan.findAndCountAll({
        where: { member_id: memberId },
        include: [Book],
        limit,
        offset,
        order: [['loan_date', 'DESC']],
      });
      return { total: count, page, totalPages: Math.ceil(count / limit), data: rows };
    },
  },

  Mutation: {
    createMember: async (_, { name, email, phone }) => {
      if (!name || !email) throw new Error('name and email are required');
      return await Member.create({ name, email, phone });
    },

    updateMember: async (_, { id, name, email, phone }) => {
      const member = await Member.findByPk(id);
      if (!member) throw new Error('Member not found');
      return await member.update({ name, email, phone });
    },

    deleteMember: async (_, { id }) => {
      const member = await Member.findByPk(id);
      if (!member) throw new Error('Member not found');
      await member.destroy();
      return { message: 'Member deleted successfully' };
    },

    createBook: async (_, { isbn, title, author, genre, total_copies = 1 }) => {
      if (!isbn || !title || !author) throw new Error('isbn, title, and author are required');
      return await Book.create({ isbn, title, author, genre, total_copies, available_copies: total_copies });
    },

    updateBook: async (_, { id, ...fields }) => {
      const book = await Book.findByPk(id);
      if (!book) throw new Error('Book not found');
      return await book.update(fields);
    },

    deleteBook: async (_, { id }) => {
      const book = await Book.findByPk(id);
      if (!book) throw new Error('Book not found');
      await book.destroy();
      return { message: 'Book deleted successfully' };
    },

    createLoan: async (_, { member_id, book_id, due_date }) => {
      const member = await Member.findByPk(member_id);
      if (!member) throw new Error('Member not found');
      const book = await Book.findByPk(book_id);
      if (!book) throw new Error('Book not found');
      if (book.available_copies < 1) throw new Error('No copies available');
      const loan = await Loan.create({ member_id, book_id, due_date, loan_date: new Date() });
      await book.update({ available_copies: book.available_copies - 1 });
      return loan;
    },

    updateLoan: async (_, { loanId, due_date, status, return_date }) => {
      const loan = await Loan.findByPk(loanId);
      if (!loan) throw new Error('Loan not found');
      if (status === 'returned' && loan.status !== 'returned') {
        const book = await Book.findByPk(loan.book_id);
        await book.update({ available_copies: book.available_copies + 1 });
      }
      return await loan.update({ due_date, status, return_date });
    },

    cancelLoan: async (_, { loanId }) => {
      const loan = await Loan.findByPk(loanId);
      if (!loan) throw new Error('Loan not found');
      if (loan.status === 'active') {
        const book = await Book.findByPk(loan.book_id);
        await book.update({ available_copies: book.available_copies + 1 });
      }
      await loan.update({ status: 'cancelled' });
      return { message: 'Loan cancelled successfully' };
    },
  },
};

module.exports = resolvers;