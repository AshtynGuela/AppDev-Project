Library Management System

A full-featured library management system built with Node.js, Express, MongoDB, and EJS templating. Features a responsive UI taken from [Libraria](https://www.templateshub.net/template/LIBRARIA-Online-Library-Template) with dark mode support and comprehensive book management capabilities.

## Features

### 🔒 Authentication & User Management
- **User Registration**: New users can create accounts with username, email, and password (email is unused for now but still required)
- **Secure Login**: Session-based authentication with encrypted passwords
- **Role-Based Access**: Separate permissions for regular users and administrators (to access administrator status, sign up with a name such as Admin1, Admin2, Admin3)
- **Session Persistence**: Stay logged in across browser sessions

### 📖 Book Catalog
- **Browse Books**: View all available books in a card-based grid layout
- **Book Details**: Each book displays:
  - Title and Author
  - Description with "See More/Less" toggle for long texts
  - ISBN number
  - Availability status (Available/Checked Out)
  - Current borrower information
  - Checkout date
  - Reservation status (if applicable)

### 🔎 Search & Filter System
- **Real-time Search**: Instant search over:
  - Book titles
  - Author names
  - ISBN numbers
  - Book descriptions
- **Status Filtering**:
  - All Books
  - Available Only
  - Checked Out Only
- **Sorting Options**:
  - Default Order
  - Title (A-Z or Z-A)
  - Author (A-Z or Z-A)
- **Search Feedback**: Live book count and filter results display

### 👤 User Features
- **Checkout Books**: Borrow available books with automatic status updates
- **Return Books**: Return checked-out books you've borrowed
- **Reserve Books**: Reserve checked-out books for next availability
- **Transaction History**: View  borrowing history with:
  - Transaction dates
  - Book titles
  - Action types (check-out/check-in)
  - Borrower information

### 👨‍💼 Administrator Features
- **Add Books**: Create new book entries with:
  - Title and Author (required)
  - ISBN (optional)
  - Description (optional)
- **Edit Books**: Modify existing book information with inline modal editor
- **Delete Books**: Remove books from the catalog with confirmation
- **View All Transactions**: Monitor all library activity across all users
- **User Management**: Access to all user checkout/return operations

### 🎨 User Interface
- **Modern Design**: Clean, gradient-based UI using LIBRARIA template
- **Dark Mode Toggle**: 
  - Seamless theme switching on all pages
  - Light Mode: Blue/purple gradient theme
  - Dark Mode: Amber/golden gradient theme
  - Theme preference saved in browser
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Visual Feedback**: 
  - Hover effects on cards and buttons
  - Status badges with color coding
  - Smooth transitions and animations
- **Accessibility**: Focus states and keyboard navigation support

### 📊 Statistics & Tracking
- **Recent Transactions**: Dashboard displays latest library activity
- **Book Count**: Real-time count of visible/total books
- **Status Indicators**: Color-coded availability badges
- **User Badges**: Visual admin role identification

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Express-Session** - Session management
- **BCrypt** - Password hashing

### Frontend
- **EJS** - Embedded JavaScript templating
- **LIBRARIA Template** - Bootstrap-based library theme
- **Font Awesome 4.7.0** - Icon library
- **CSS Variables** - Dynamic theming
- **Vanilla JavaScript** - Client-side interactivity

### Features Implementation
- **Flexbox & CSS Grid** - Responsive layouts
- **LocalStorage API** - Theme persistence
- **CSS Line Clamping** - Description truncation
- **Modal Dialogs** - Edit book interface
- **Real-time Filtering** - Client-side search

## 📁 Project Structure

```
Final-Proj-It-1/
├── models/
│   ├── Book.js           # Book schema and model
│   ├── User.js           # User schema and model
│   └── Transaction.js    # Transaction schema and model
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── books.js          # Book management routes
│   └── transactions.js   # Transaction routes
├── views/
│   ├── login.ejs         # Login page
│   ├── register.ejs      # Registration page
│   ├── dashboard.ejs     # Main dashboard with book catalog
│   └── history.ejs       # Transaction history page
├── public/
│   ├── optimized-style.css  # Core CSS (186 lines, optimized)
│   ├── css/              # Font Awesome styles
│   ├── js/               # jQuery, Bootstrap, template JS
│   ├── images/           # Template images and favicon
│   └── fonts/            # Font Awesome fonts
├── server.js             # Main application entry point
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Final-Proj-It-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure MongoDB**
   - Create a MongoDB database (local or cloud)
   - Update the connection string in `server.js`:
   ```javascript
   mongoose.connect('your-mongodb-connection-string')
   ```

4. **Set up session secret**
   - Update the session secret in `server.js` for production:
   ```javascript
   secret: 'your-secure-random-secret'
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Access the application**
   - Open browser and navigate to `http://localhost:3000`

## 👥 User Roles

### Regular User
- Browse book catalog
- Search and filter books
- Checkout available books
- Return borrowed books
- Reserve checked-out books
- View personal transaction history

### Administrator
- All regular user permissions
- Add new books to catalog
- Edit existing book information
- Delete books from catalog
- View all user transactions
- Access to complete library statistics

## 🎯 Usage Guide

### For First-Time Users
1. Navigate to the registration page
2. Create an account with username, email, and password
3. Login with your credentials
4. Browse the book catalog on the dashboard
5. Use search/filter to find specific books
6. Click "Checkout" to borrow available books

### For Administrators
1. Login with admin credentials
2. Access the "Add New Book" form on dashboard
3. Fill in book details and submit
4. Use "Edit" button on book cards to modify information
5. Use "Delete" button to remove books (with confirmation)
6. Monitor all transactions in the Recent Transactions section

### Theme Customization
- Click the floating theme toggle button (bottom-right corner)
- Toggle between light and dark modes
- Theme preference is automatically saved

## 🔒 Security Features
- Password hashing with BCrypt
- Session-based authentication
- Protected routes with middleware
- CSRF protection for forms
- SQL injection prevention through Mongoose
- Role-based access control

## 📱 Responsive Design
- **Desktop**: Full multi-column grid layout
- **Tablet**: Adjusted grid with 2 columns
- **Mobile**: Single column card layout
- Touch-friendly buttons and forms
- Optimized font sizes for all screens

## 🎨 Color Schemes

### Light Mode
- Primary: Blue/Purple gradient (#667eea → #764ba2)
- Background: Light gray (#f5f7fa)
- Cards: White (#fff)
- Text: Dark gray (#333)

### Dark Mode
- Primary: Amber/Golden gradient (#d97706 → #ca8a04)
- Background: Dark gray (#1a1a1a)
- Cards: Medium gray (#2d2d2d)
- Text: Light gray (#e0e0e0)

## 🐛 Known Features
- Client-side search (no backend API needed)
- Optimized CSS (99.2% reduction from original template)
- Smooth dark mode transitions
- Book description truncation with expand/collapse
- Real-time filter results
- Consistent card heights with flexbox
- Modal dialogs for editing

## 📝 Future Enhancements
- Email notifications for due dates
- Book cover image uploads
- Advanced search with multiple filters
- Export transaction reports
- User profile management
- Book ratings and reviews
- Due date tracking and overdue fines
- Barcode scanning support

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License
This project is for educational purposes.

## 👨‍💻 Developer
Created as a final project for App Development course (2nd Year, 1st Semester)

## 📧 Support
For issues or questions, please create an issue in the repository.

---

**Made with ❤️ using Node.js, Express, and MongoDB**
