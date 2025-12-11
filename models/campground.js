/**
 * models/campground.js
 * -----------------------------------------------------
 * Mongoose schema for Campgrounds.
 *
 * Features:
 *  - Stores image data (with Cloudinary filenames + URLs)
 *  - Supports thumbnail virtuals for optimized display
 *  - Stores GeoJSON geometry for mapping (Point type)
 *  - Tracks campground author (User reference)
 *  - Manages associated reviews (array of Review ObjectIds)
 *  - Automatically deletes related reviews when campground is deleted
 */

const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


/* -----------------------------------------------------
   IMAGE SUB-SCHEMA
------------------------------------------------------ */
/**
 * Represents each uploaded image.
 * Includes a virtual "thumbnail" for displaying smaller
 * versions of Cloudinary images without storing them.
 */
const ImageSchema = new Schema({
    url: String,
    filename: String
});

/**
 * Virtual field: image.thumbnail
 * Cloudinary transformation: replace `/upload` with `/upload/w_200`
 * This automatically creates a resized version of the image.
 */
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});


/* Enable virtuals to show up in JSON (e.g., when using map popups) */
const opts = { toJSON: { virtuals: true } };


/* -----------------------------------------------------
   MAIN CAMPGROUND SCHEMA
------------------------------------------------------ */
const CampgroundSchema = new Schema({
    title: String,

    // Array of image objects
    images: [ImageSchema],

    /**
     * geometry (GeoJSON Point)
     * Required for mapping (Mapbox, MapTiler, Leaflet, etc.)
     */
    geometry: {
        type: {
            type: String,
            enum: ['Point'],   // Ensures valid GeoJSON Point type
            required: true
        },
        coordinates: {
            type: [Number],    // [longitude, latitude]
            required: true
        }
    },

    price: Number,
    description: String,
    location: String,

    /**
     * author (User reference)
     * Stores which logged-in user created the campground.
     */
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    /**
     * reviews (Review references)
     * An array of ObjectIds pointing to Review documents.
     */
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);


/* -----------------------------------------------------
   VIRTUAL: Popup markup for map display
------------------------------------------------------ */
/**
 * Used by MapTiler/Mapbox popups.
 * Appears inside GeoJSON properties.
 *
 * Example output:
 * <strong><a href="/campgrounds/123">Title</a></strong>
 * <p>Description...</p>
 */
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});


/* -----------------------------------------------------
   MIDDLEWARE: Delete associated reviews when campground is deleted
------------------------------------------------------ */
/**
 * Runs AFTER a campground is removed using findOneAndDelete.
 * Automatically deletes all reviews where the ID exists
 * in the campground.reviews array.
 */
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        });
    }
});


/* -----------------------------------------------------
   MODEL EXPORT
------------------------------------------------------ */
module.exports = mongoose.model('Campground', CampgroundSchema);
