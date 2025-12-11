/**
 * controllers/reviews.js
 * -----------------------------------------------------
 * Handles creation and deletion of reviews for campgrounds.
 *
 * Review flow:
 *  - Stored as separate Review documents
 *  - Campgrounds hold an array of review ObjectIds
 *  - Review authorship is tracked via req.user._id
 */

const Campground = require('../models/campground');
const Review = require('../models/review');


/* -----------------------------------------------------
   POST: Create a new review for a campground
------------------------------------------------------ */
/**
 * Creates a new review and associates it with a campground.
 *
 * Steps:
 *  1. Find the campground by ID
 *  2. Create a Review document using form data
 *  3. Attach the logged-in user as review.author
 *  4. Push review _id into campground.reviews array
 *  5. Save both review and campground
 */
module.exports.createReview = async (req, res) => {
    // Step 1: Find the campground the review belongs to
    const campground = await Campground.findById(req.params.id);

    // Step 2: Create a review using submitted data (req.body.review)
    const review = new Review(req.body.review);

    // Step 3: Assign review author (logged-in user)
    review.author = req.user._id;

    // Step 4: Add review reference inside campground's reviews array
    campground.reviews.push(review);

    // Step 5: Save both models
    await review.save();
    await campground.save();

    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
};


/* -----------------------------------------------------
   DELETE: Remove a review
------------------------------------------------------ */
/**
 * Deletes a review and removes its ObjectId from the campground.
 *
 * Steps:
 *  1. Remove the reviewId from campground.reviews array using $pull
 *  2. Delete the review document from the Review collection
 */
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    // Step 1: Pull reviewId from campground's reviews array
    await Campground.findByIdAndUpdate(id, { 
        $pull: { reviews: reviewId } 
    });

    // Step 2: Delete the review document itself
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
};
