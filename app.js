/**
 * app.js — Main server file for YelpCamp
 * -----------------------------------------------------
 * Responsibilities:
 *  - Load environment variables
 *  - Connect to MongoDB
 *  - Configure Express, sessions, passport
 *  - Register routes and global middleware
 *  - Handle errors
 */

// Load .env variables in development environment
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// Core dependencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// Templating engine
const ejsMate = require('ejs-mate');

// Authentication + Sessions
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Custom utilities
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

// Mongoose User Model
const User = require('./models/user');

// Route files
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');

/* -----------------------------------------------------
   DATABASE CONNECTION
------------------------------------------------------ */

// Connect to local MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

// Log any connection errors
db.on("error", console.error.bind(console, "connection error:"));

// Log once DB is connected
db.once("open", () => {
    console.log("Database connected");
});

/* -----------------------------------------------------
   EXPRESS APP INITIALIZATION
------------------------------------------------------ */
const app = express();

// Register ejs-mate as template engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

// Set path for EJS views directory
app.set('views', path.join(__dirname, 'views'));

/* -----------------------------------------------------
   MIDDLEWARE SETUP
------------------------------------------------------ */

// Parse form data from req.body
app.use(express.urlencoded({ extended: true }));

// Allow PUT & DELETE with ?_method=PUT
app.use(methodOverride('_method'));

// Serve static files (CSS, JS, images) from public folder
app.use(express.static(path.join(__dirname, 'public')));

/* -----------------------------------------------------
   SESSION CONFIGURATION
------------------------------------------------------ */

// Basic session setup (sufficient for development)
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',  // You may move this to .env
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Expires in 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

// Register session + flash messaging
app.use(session(sessionConfig));
app.use(flash());

/* -----------------------------------------------------
   PASSPORT CONFIGURATION (USER AUTHENTICATION)
------------------------------------------------------ */

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Use username/password authentication via passport-local
passport.use(new LocalStrategy(User.authenticate()));

// Define how user is stored and retrieved from session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* -----------------------------------------------------
   GLOBAL MIDDLEWARE FOR ALL ROUTES
   - Makes flash messages + currentUser available in all templates
------------------------------------------------------ */
app.use((req, res, next) => {

    // Logs current session (useful for development)
    console.log(req.session);

    // Add commonly used variables to all EJS templates
    res.locals.currentUser = req.user;               // User logged in or null
    res.locals.success = req.flash('success');       // Flash success messages
    res.locals.error = req.flash('error');           // Flash error messages
    res.locals.mapTilerKey = process.env.MAPTILER_API_KEY; // Optional map API

    next();
});

/* -----------------------------------------------------
   ROUTES
------------------------------------------------------ */

// Routes for authentication (register, login, logout)
app.use('/', userRoutes);

// Routes for campgrounds (/campgrounds/*)
app.use('/campgrounds', campgroundRoutes);

// Nested routes for reviews under each campground
app.use('/campgrounds/:id/reviews', reviewRoutes);

// Home page route
app.get('/', (req, res) => {
    res.render('home');
});

/* -----------------------------------------------------
   ERROR HANDLING
------------------------------------------------------ */

// If no route is matched, throw a 404 error
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Global error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;

    // Default message if one isn't provided
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';

    // Render error template
    res.status(statusCode).render('error', { err });
});

/* -----------------------------------------------------
   START SERVER
------------------------------------------------------ */

app.listen(3000, () => {
    console.log('Serving on port 3000');
});
