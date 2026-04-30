const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

/**
 * @swagger
 * /loans:
 *   post:
 *     summary: Create a new loan (borrow a book)
 *     tags: [Loans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [member_id, book_id, due_date]
 *             properties:
 *               member_id:
 *                 type: integer
 *               book_id:
 *                 type: integer
 *               due_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Loan created
 * /loans/{loanId}:
 *   get:
 *     summary: Get loan by ID
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Loan found
 *       404:
 *         description: Loan not found
 *   put:
 *     summary: Update a loan
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               due_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, returned, overdue, cancelled]
 *               return_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Loan updated
 *   delete:
 *     summary: Cancel a loan
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: loanId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Loan cancelled
 */

router.get('/:loanId', loanController.getLoanById);
router.post('/', loanController.createLoan);
router.put('/:loanId', loanController.updateLoan);
router.delete('/:loanId', loanController.deleteLoan);

module.exports = router;