const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
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
    book.checkedOutDate = new Date();
    book.reservedBy = null; // Clear reservation when checked out
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
    book.checkedOutDate = null;
    // Keep reservedBy intact so the person who reserved can check it out
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

// Reserve a book
router.post('/reserve/:id', isAuthenticated, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).send('Book not found');
    }

    if (book.status === 'available') {
      return res.status(400).send('Book is available, you can check it out directly');
    }

    // Check if already reserved by this user
    if (book.reservedBy && book.reservedBy.toString() === req.session.userId) {
      return res.status(400).send('You have already reserved this book');
    }

    // Set reservation
    book.reservedBy = req.session.userId;
    await book.save();

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Reserve book error:', error);
    res.status(500).send('Error reserving book');
  }
});

// Cancel reservation
router.post('/cancel-reserve/:id', isAuthenticated, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).send('Book not found');
    }

    // Only the user who reserved can cancel, or an admin
    const User = require('../models/User');
    const user = await User.findById(req.session.userId);
    const isAdmin = /^admin\d+$/i.test(user.username);
    
    if (book.reservedBy && book.reservedBy.toString() !== req.session.userId && !isAdmin) {
      return res.status(403).send('You cannot cancel someone else\'s reservation');
    }

    // Clear reservation
    book.reservedBy = null;
    await book.save();

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).send('Error canceling reservation');
  }
});

// Edit a book (admin only)
router.post('/edit/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, author, description, isbn } = req.body;
    
    await Book.findByIdAndUpdate(req.params.id, {
      title,
      author,
      description: description || '',
      isbn: isbn || undefined
    });
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Edit book error:', error);
    res.status(500).send('Error editing book');
  }
});

// Delete a book (admin only)
router.post('/delete/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).send('Error deleting book');
  }
});

module.exports = router;
