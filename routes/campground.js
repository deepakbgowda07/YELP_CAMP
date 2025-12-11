/**
 * routes/campground.js
 * -----------------------------------------------------
 * Handles all routes under /campgrounds
 *
 * Features:
 *  - Index (list all campgrounds)
 *  - Create new campground
 *  - Show individual campground
 *  - Edit campground
 *  - Delete campground
 *
 * Middlewares involved:
 *  - isLoggedIn        → User must be authenticated
 *  - isAuthor          → User must own the campground
 *  - validateCampground → Joi validation for form data
 *  - upload.array('image') → Multer upload handler
 */

const express = require('express');
const router = express.Router();

const campgrounds = require('../controllers/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

// Multer + Cloudinary storage
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// Model (not used directly in this file but often helpful for debugging)
const Campground = require('../models/campground');


/* -----------------------------------------------------
   ROUTE: "/"  
   - GET: List all campgrounds
   - POST: Create new campground
------------------------------------------------------ */
router.route('/')
    .get(catchAsync(campgrounds.index))  // Show all campgrounds

    .post(
        isLoggedIn,                       // Must be logged in
        upload.array('image'),            // Handle multiple image uploads
        validateCampground,               // Validate form data
        catchAsync(campgrounds.createCampground)  // Controller logic
    );


/* -----------------------------------------------------
   ROUTE: "/new"
   - GET: Render "new campground" form
------------------------------------------------------ */
router.get('/new',
    isLoggedIn,                          // Only logged-in users can create
    campgrounds.renderNewForm
);


/* -----------------------------------------------------
   ROUTE: "/:id"
   - GET: Show campground details
   - PUT: Update campground
   - DELETE: Remove campground
------------------------------------------------------ */
router.route('/:id')

    .get(
        catchAsync(campgrounds.showCampground) // Show a single campground
    )

    .put(
        isLoggedIn,                       // Must be logged in
        isAuthor,                         // Must own the campground
        upload.array('image'),            // Allow updating images
        validateCampground,               // Validate updated fields
        catchAsync(campgrounds.updateCampground)
    )

    .delete(
        isLoggedIn,                       // Must be logged in
        isAuthor,                         // Must be the author
        catchAsync(campgrounds.deleteCampground)
    );


/* -----------------------------------------------------
   ROUTE: "/:id/edit"
   - GET: Render edit form for a campground
------------------------------------------------------ */
router.get('/:id/edit',
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.renderEditForm)
);


module.exports = router;
