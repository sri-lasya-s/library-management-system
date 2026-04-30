const express = require('express');
const router = express.Router();
const bookService = require('../services/bookService');

/**
 * @swagger
 * /services/books/{isbn}/details:
 *   get:
 *     summary: Get book details from OpenLibrary (third-party)
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book details from OpenLibrary
 * /services/members/{memberId}/recommendations:
 *   get:
 *     summary: Get book recommendations based on loan history
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book recommendations
 */

router.get('/books/:isbn/details', async (req, res, next) => {
  try {
    const details = await bookService.getBookDetails(req.params.isbn);
    res.json(details);
  } catch (err) { next(err); }
});

router.get('/members/:memberId/recommendations', async (req, res, next) => {
  try {
    const recommendations = await bookService.getBookRecommendations(req.params.memberId);
    res.json(recommendations);
  } catch (err) { next(err); }
});

module.exports = router;