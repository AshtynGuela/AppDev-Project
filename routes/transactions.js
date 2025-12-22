const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

// View borrower history
router.get('/history', isAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('book')
      .populate('user')
      .sort({ date: -1 });

    res.render('history', { transactions });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).send('Error fetching transaction history');
  }
});

// View history for a specific book
router.get('/book/:bookId', isAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.find({ book: req.params.bookId })
      .populate('book')
      .populate('user')
      .sort({ date: -1 });

    res.render('book-history', { transactions });
  } catch (error) {
    console.error('Book history error:', error);
    res.status(500).send('Error fetching book history');
  }
});

module.exports = router;
