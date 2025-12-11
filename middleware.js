/**
 * middleware.js
 * -----------------------------------------------------
 * Contains all custom middleware used across YelpCamp:
 *  - Authentication (isLoggedIn)
 *  - Authorization (isAuthor, isReviewAuthor)
 *  - Joi Validation (campground, review, user)
 */

const { campgroundSchema, reviewSchema, userSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');


/* -----------------------------------------------------
   AUTHENTICATION MIDDLEWARE
------------------------------------------------------ */

/**
 * isLoggedIn
 * Ensures user is authenticated via Passport.
 * If not, redirects to login and stores attempted URL.
 */
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};


/* -----------------------------------------------------
   JOI VALIDATION MIDDLEWARE
------------------------------------------------------ */

/**
 * validateCampground
 * Validates campground creation/edit data using Joi.
 */
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
};


/**
 * validateReview
 * Validates review submission using Joi.
 */
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
};


/**
 * validateUser
 * Backend validation for registration:
 *  - Email format
 *  - Password strength
 *  - Username rules
 */
module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
};


/* -----------------------------------------------------
   AUTHORIZATION MIDDLEWARE
------------------------------------------------------ */

/**
 * isAuthor
 * Checks whether the logged-in user is the creator
 * of the campground they are modifying.
 */
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};


/**
 * isReviewAuthor
 * Ensures that only the user who wrote a review can delete it.
 */
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};
