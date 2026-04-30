const { Member, Book, Loan } = require('./models');

async function seedData() {
  try {
    // Check if data already exists
    const bookCount = await Book.count();
    if (bookCount > 0) {
      console.log('✅ Data already exists, skipping seed');
      return;
    }

    // Create members
    const members = await Member.bulkCreate([
      { name: 'John Doe', email: 'john@example.com', phone: '555-1234' },
      { name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678' },
      { name: 'Bob Johnson', email: 'bob@example.com', phone: '555-9999' },
    ]);

    // Create books
    const books = await Book.bulkCreate([
      { isbn: '978-0-7432-7356-5', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', total_copies: 3, available_copies: 3 },
      { isbn: '978-0-06-112008-4', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic', total_copies: 2, available_copies: 2 },
      { isbn: '978-0-14-028329-7', title: '1984', author: 'George Orwell', genre: 'Dystopian', total_copies: 4, available_copies: 4 },
      { isbn: '978-0-7432-7357-2', title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Classic', total_copies: 2, available_copies: 2 },
      { isbn: '978-0-14-303943-3', title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', total_copies: 3, available_copies: 3 },
    ]);

    // Create some loans
    await Loan.bulkCreate([
      { member_id: members[0].id, book_id: books[0].id, loan_date: new Date(), due_date: '2026-05-30', status: 'active' },
      { member_id: members[1].id, book_id: books[1].id, loan_date: new Date(), due_date: '2026-05-15', status: 'active' },
    ]);

    console.log('✅ Sample data created successfully');
  } catch (error) {
    console.log('⚠️ Seed data error:', error.message);
  }
}

module.exports = seedData;