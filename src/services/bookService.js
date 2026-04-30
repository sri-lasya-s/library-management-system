const axios = require('axios');
const { Book, Loan } = require('../models');

// Fetch book details from OpenLibrary (free, no API key needed)
exports.getBookDetails = async (isbn) => {
  try {
    const response = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    const key = `ISBN:${isbn}`;
    const data = response.data[key];
    
    if (!data) {
      return { error: 'Book not found in OpenLibrary' };
    }

    return {
      title: data.title,
      authors: data.authors?.map(a => a.name) || [],
      publishDate: data.publish_date,
      publishers: data.publishers?.map(p => p.name) || [],
      numberOfPages: data.number_of_pages,
      cover: data.cover?.large || data.cover?.medium || null,
      subjects: data.subjects?.slice(0, 5).map(s => s.name) || [],
      description: data.excerpts?.[0]?.text || 'No description available',
      openLibraryUrl: `https://openlibrary.org/isbn/${isbn}`
    };
  } catch (error) {
    return { error: 'Failed to fetch from OpenLibrary', details: error.message };
  }
};

// Get book recommendations based on genre
exports.getBookRecommendations = async (memberId) => {
  try {
    // Get member's loan history
    const loans = await Loan.findAll({
      where: { member_id: memberId },
      include: [{ model: Book }],
      limit: 10,
      order: [['loan_date', 'DESC']]
    });

    if (loans.length === 0) {
      // Default recommendations if no history
      const books = await Book.findAll({ limit: 5 });
      return {
        basedOn: 'popular books',
        recommendations: books.map(b => ({
          id: b.id,
          title: b.title,
          author: b.author,
          genre: b.genre,
          available: b.available_copies > 0
        }))
      };
    }

    // Find most common genre in loan history
    const genres = loans
      .map(l => l.Book?.genre)
      .filter(Boolean);
    
    const genreCount = {};
    genres.forEach(g => { genreCount[g] = (genreCount[g] || 0) + 1; });
    const topGenre = Object.keys(genreCount).sort((a, b) => genreCount[b] - genreCount[a])[0];

    // Find books in same genre not yet borrowed
    const borrowedBookIds = loans.map(l => l.book_id);
    const { Op } = require('sequelize');
    
    const recommended = await Book.findAll({
      where: {
        genre: topGenre,
        id: { [Op.notIn]: borrowedBookIds },
        available_copies: { [Op.gt]: 0 }
      },
      limit: 5
    });

    // If not enough, fill with any available books
    if (recommended.length < 3) {
      const extra = await Book.findAll({
        where: { 
          id: { [Op.notIn]: borrowedBookIds },
          available_copies: { [Op.gt]: 0 }
        },
        limit: 5
      });
      recommended.push(...extra);
    }

    return {
      basedOn: `your interest in ${topGenre}`,
      recommendations: recommended.slice(0, 5).map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        genre: b.genre,
        available: b.available_copies > 0
      }))
    };
  } catch (error) {
    return { error: 'Failed to get recommendations', details: error.message };
  }
};