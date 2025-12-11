/**
 * routes/review.js
 * -----------------------------------------------------
 * Handles all review-related routes nested under:
 *   /campgrounds/:id/reviews
 *
 * Notes:
 *  - mergeParams: true → allows access to :id from parent routes.
 *  - Uses middleware for authentication, authorization, and validation.
 */

const express = require('express');

// mergeParams allows this router to access :id from /campgrounds/:id
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/review');
const catchAsync = require('../utils/catchAsync');


/* -----------------------------------------------------
   POST: "/campgrounds/:id/reviews"
   Create a new review for a campground
------------------------------------------------------ */
/**
 * Middlewares:
 *  - isLoggedIn       → Only logged-in users can write reviews
 *  - validateReview   → Joi validation of review form fields
 */
router.post(
    '/',
    isLoggedIn,
    validateReview,
    catchAsync(reviews.createReview)
);


/* -----------------------------------------------------
   DELETE: "/campgrounds/:id/reviews/:reviewId"
   Delete an existing review
------------------------------------------------------ */
/**
 * Middlewares:
 *  - isLoggedIn        → Must be logged in
 *  - isReviewAuthor    → Only the author of the review can delete it
 */
router.delete(
    '/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    catchAsync(reviews.deleteReview)
);


/* -----------------------------------------------------
   EXPORT ROUTER
------------------------------------------------------ */
module.exports = router;
