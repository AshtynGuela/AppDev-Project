require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Validate required environment variables
if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in environment variables');
  console.error('Please set MONGODB_URI in your Render environment variables');
  process.exit(1);
}

if (!process.env.SESSION_SECRET) {
  console.error('ERROR: SESSION_SECRET is not defined in environment variables');
  console.error('Please set SESSION_SECRET in your Render environment variables');
  process.exit(1);
}

console.log('Environment variables loaded successfully');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set ✓' : 'Not set ✗');
console.log('Session Secret:', process.env.SESSION_SECRET ? 'Set ✓' : 'Not set ✗');

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: false, // Set to false to work on Render
    sameSite: 'lax'
  }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const transactionRoutes = require('./routes/transactions');

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/transactions', transactionRoutes);

// Home route
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// Login page
app.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: null });
});

// Register page
app.get('/register', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.render('register', { error: null });
});

// Dashboard (protected route)
app.get('/dashboard', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  
  const User = require('./models/User');
  const Book = require('./models/Book');
  const Transaction = require('./models/Transaction');
  
  try {
    const user = await User.findById(req.session.userId);
    const books = await Book.find()
      .populate('currentBorrower')
      .populate('reservedBy')
      .sort({ title: 1 });
    const recentTransactions = await Transaction.find()
      .populate('book')
      .populate('user')
      .sort({ date: -1 })
      .limit(10);
    
    // Check if user is admin (adminX format, case insensitive)
    const isAdmin = /^admin\d+$/i.test(user.username);
    
    res.render('dashboard', { 
      user, 
      books,
      recentTransactions,
      isAdmin
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
