const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

// Add a new book
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const { title, author, description, isbn } = req.body;

    const book = new Book({
      title,
      author,
      description: description || '',
      isbn: isbn || undefined,
      addedBy: req.session.userId
    });

    await book.save();
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).send('Error adding book');
  }
});

// Check out a book
router.post('/checkout/:id', isAuthenticated, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).send('Book not found');
    }

    if (book.status === 'checked-out') {
      return res.status(400).send('Book is already checked out');
    }

    // Update book status
    book.status = 'checked-out';
    book.currentBorrower = req.session.userId;
    await book.save();

    // Create transaction record
    const transaction = new Transaction({
      book: book._id,
      user: req.session.userId,
      type: 'check-out',
      notes: req.body.notes
    });
    await transaction.save();

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).send('Error checking out book');
  }
});

// Return (check-in) a book
router.post('/checkin/:id', isAuthenticated, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).send('Book not found');
    }

    if (book.status === 'available') {
      return res.status(400).send('Book is already available');
    }

    // Update book status
    book.status = 'available';
    book.currentBorrower = null;
    await book.save();

    // Create transaction record
    const transaction = new Transaction({
      book: book._id,
      user: req.session.userId,
      type: 'check-in',
      notes: req.body.notes
    });
    await transaction.save();

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).send('Error checking in book');
  }
});

// Delete a book (optional feature)
router.post('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).send('Error deleting book');
  }
});

module.exports = router;
