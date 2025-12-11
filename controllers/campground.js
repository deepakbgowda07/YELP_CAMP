/**
 * controllers/campgrounds.js
 * -----------------------------------------------------
 * Handles all campground-related logic:
 *  - Listing campgrounds
 *  - Showing a single campground
 *  - Creating new campgrounds
 *  - Editing campgrounds
 *  - Deleting campgrounds
 *
 * Integrates:
 *  - MapTiler for geocoding locations
 *  - Cloudinary for image uploads/deletions
 */

const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const maptilerClient = require("@maptiler/client");

// Configure MapTiler using API key from .env
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;


/* -----------------------------------------------------
   GET: List all campgrounds
------------------------------------------------------ */
/**
 * Renders the index page with a list of all campgrounds.
 */
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};


/* -----------------------------------------------------
   GET: Render form to create a new campground
------------------------------------------------------ */
/**
 * Displays the "new campground" creation form.
 */
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};


/* -----------------------------------------------------
   POST: Create a new campground
------------------------------------------------------ */
/**
 * Handles creating a new campground.
 *
 * Steps:
 * 1. Geocode user-entered location using MapTiler.
 * 2. Create campground document with form data.
 * 3. Add uploaded images from Cloudinary.
 * 4. Save campground + associate with logged-in user.
 */
module.exports.createCampground = async (req, res, next) => {

    // Geocode the provided location string
    const geoData = await maptilerClient.geocoding.forward(
        req.body.campground.location,
        { limit: 1 }
    );

    // If no geocoding results found → show error
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect('/campgrounds/new');
    }

    // Create new campground using submitted data
    const campground = new Campground(req.body.campground);

    // Save geolocation coordinates + formatted location name
    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;

    // Add uploaded images (stored in Cloudinary)
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));

    // Set campground's author to logged-in user
    campground.author = req.user._id;

    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};


/* -----------------------------------------------------
   GET: Show details for one campground
------------------------------------------------------ */
/**
 * Shows a single campground with:
 *  - Associated reviews
 *  - Review authors
 *  - Campground author
 */
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        })
        .populate('author');

    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { campground });
};


/* -----------------------------------------------------
   GET: Render edit campground form
------------------------------------------------------ */
/**
 * Displays the edit form for an existing campground.
 */
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { campground });
};


/* -----------------------------------------------------
   PUT: Update campground
------------------------------------------------------ */
/**
 * Handles editing an existing campground.
 *
 * Steps:
 * 1. Geocode updated location (if edited)
 * 2. Update campground fields
 * 3. Add new images (if any)
 * 4. Delete selected images from Cloudinary + DB
 */
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;

    // Geocode updated location
    const geoData = await maptilerClient.geocoding.forward(
        req.body.campground.location,
        { limit: 1 }
    );

    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect(`/campgrounds/${id}/edit`);
    }

    // Update campground with new form data
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

    // Update geolocation data
    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;

    // Add new images (if uploaded)
    const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...newImages);

    await campground.save();

    // If user selected images to delete
    if (req.body.deleteImages) {

        // Delete images from Cloudinary
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }

        // Remove image references from MongoDB
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } }
        });
    }

    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};


/* -----------------------------------------------------
   DELETE: Remove campground
------------------------------------------------------ */
/**
 * Deletes a campground and all its associated data.
 * (Associated reviews are removed via Mongoose middleware)
 */
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
};
