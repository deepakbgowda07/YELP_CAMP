/**
 * models/review.js
 * -----------------------------------------------------
 * Represents a user review on a campground.
 *
 * Each review contains:
 *  - body: the text content of the review
 *  - rating: numeric rating (1–5)
 *  - author: a reference to the User who wrote it
 *
 * Reviews are connected to campgrounds but stored separately.
 * Campgrounds hold an array of review ObjectIds.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* -----------------------------------------------------
   REVIEW SCHEMA
------------------------------------------------------ */
const reviewSchema = new Schema({
    /**
     * body
     * The written content of the review.
     */
    body: String,

    /**
     * rating
     * Numeric rating from the user.
     * (Joi validation enforces 1–5 in schemas.js)
     */
    rating: Number,

    /**
     * author
     * The User who wrote the review.
     * Stored as a reference to a User document.
     */
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


/* -----------------------------------------------------
   MODEL EXPORT
------------------------------------------------------ */
module.exports = mongoose.model("Review", reviewSchema);
