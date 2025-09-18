const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground'); // ✅ fixed path
const ejsMate = require('ejs-mate');
const morgan = require('morgan');
// -------------------------
// Database Connection
// -------------------------
mongoose.connect('mongodb://127.0.0.1:27017/yelpdb');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("✅ Database connected");
});

// -------------------------
// App Setup
// -------------------------
const app = express();
app.engine('ejs', ejsMate)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride('_method')); // Support PUT & DELETE in forms
app.use(morgan('tiny'));
// -------------------------
// Routes
// -------------------------

app.use((req, res, next) => {
    console.log("Hello from the middleware!");
    next();
});
app.get('/', (req, res) => {
    res.render('home', { title: 'YelpCamp' });
});

// Show all campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

// Form to create new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// Create new campground
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

// Show specific campground
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

// Form to edit campground
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
});

// Update campground
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

// Delete campground
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

// -------------------------
// Server
// -------------------------
app.listen(3000, () => {
    console.log('🚀 Serving on http://localhost:3000');
});
