// In seeds/index.js

const mongoose = require('mongoose');
const worldCities = require('./worldCities');
const { places, descriptors } = require('./seedHelpers');
const { reviewPhrases } = require('./reviewHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');

// ===================================
// DATABASE CONNECTION
// ===================================
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
    seedDB().then(() => {
        console.log('Database seeding complete. Closing connection.');
        mongoose.connection.close();
    });
});

// ===================================
// HELPER FUNCTIONS
// ===================================
const sample = array => array[Math.floor(Math.random() * array.length)];

// ===================================
// NEW: getRandomImages FUNCTION
// This function now generates random URLs from picsum.photos
// ===================================
const getRandomImages = () => {
    const numImages = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 images
    const images = [];
    for (let i = 0; i < numImages; i++) {
        images.push({
            // We add a random number to the URL to make sure we get a different image each time
            url: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 5000) + i}`,
            // We can use a placeholder filename, as it's not a Cloudinary upload
            filename: `PicsumImage/${Math.floor(Math.random() * 1000)}`
        });
    }
    return images;
};


// ===================================
// THE SEED FUNCTION
// ===================================
const seedDB = async () => {
    // Start fresh: delete all existing campgrounds and reviews
    await Campground.deleteMany({});
    console.log('Deleted old campgrounds.');
    await Review.deleteMany({});
    console.log('Deleted old reviews.');

    // ===================================
    // NEW: AUTHOR IDs ARRAY
    // These are the real User IDs from your database
    // ===================================
    const allAuthorIds = [
        '68fdcfe18364c6740d3fa986',
        '6901f3c0939121291e4dcedb'
    ];

    // --- The error-checking "if" block has been removed ---
    
    // This will be the author for all the CAMGROUNDS
    const mainCampAuthor = allAuthorIds[0];

    // Loop 200 times
    for (let i = 0; i < 200; i++) {
        const randomCityIndex = Math.floor(Math.random() * worldCities.length);
        const cityData = worldCities[randomCityIndex];

        const price = Math.floor(Math.random() * 40) + 10;
        const title = `${sample(descriptors)} ${sample(places)}`;
        const location = `${cityData.city}, ${cityData.country}`;

        const camp = new Campground({
            author: mainCampAuthor, // Main author sets the campground
            location: location,
            title: title,
            description: `Come explore ${title}! Nestled near ${location}, this campground offers a perfect escape.`,
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cityData.longitude,
                    cityData.latitude,
                ]
            },
            images: getRandomImages() // Use the new picsum function
        });

        // ===================================
        // UPDATED: ADDING REVIEWS WITH RANDOM AUTHORS
        // ===================================
        const numReviews = Math.floor(Math.random() * 2) + 2; // 2 or 3 reviews
        for (let j = 0; j < numReviews; j++) {
            const review = new Review({
                body: sample(reviewPhrases),
                rating: Math.floor(Math.random() * 3) + 3, // Random rating from 3, 4, or 5
                author: sample(allAuthorIds) // <-- NEW: Picks a RANDOM author from your list
            });
            await review.save();
            camp.reviews.push(review);
        }

        await camp.save();
    }

    console.log('Seeded 200 new campgrounds with random images and reviews.');
}