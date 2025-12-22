const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user || !/^admin\d+$/i.test(user.username)) {
      return res.status(403).send('Only administrators can perform this action');
    }
    next();
  } catch (error) {
    return res.status(500).send('Server error');
  }
};

// View borrower history
router.get('/history', isAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('book')
      .populate('user')
      .sort({ date: -1 });

    // Check if user is admin
    const user = await User.findById(req.session.userId);
    const isAdmin = /^admin\d+$/i.test(user.username);

    res.render('history', { transactions, isAdmin });
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

// Clear transaction history (admin only)
router.post('/clear-history', isAuthenticated, isAdmin, async (req, res) => {
  try {
    await Transaction.deleteMany({});
    res.redirect('/transactions/history');
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).send('Error clearing transaction history');
  }
});

module.exports = router;
