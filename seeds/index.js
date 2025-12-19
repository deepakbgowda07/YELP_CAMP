// seeds/index.js

const mongoose = require('mongoose');
const worldCities = require('./worldCities');
const { places, descriptors } = require('./seedHelpers');
const { reviewPhrases } = require('./reviewHelpers');

const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user'); // <-- IMPORTANT

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

// Helper
const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const getRandomImages = () => {
    const num = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: num }).map((_, i) => ({
        url: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 5000) + i}`,
        filename: `PicsumImage/${Math.floor(Math.random() * 1000)}`
    }));
};


async function seedDB() {

    // CLEAN OLD DATA
    await Campground.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    console.log("Deleted old campgrounds, reviews, and users.");

    // ---------------------------------------------------------
    // STEP 1: CREATE 3 USERS FOR REVIEW AUTHOR SEEDING
    // ---------------------------------------------------------
    const users = [];

    const seedUsersData = [
        { username: "Alice", email: "alice@example.com", password: "AlicePass1!" },
        { username: "Bob", email: "bob@example.com", password: "BobPass1!" },
        { username: "Charlie", email: "charlie@example.com", password: "CharliePass1!" }
    ];

    for (const data of seedUsersData) {
        const user = new User({ username: data.username, email: data.email });
        const registeredUser = await User.register(user, data.password);
        users.push(registeredUser._id);
    }

    console.log("Created 3 seed users:", users);

    const mainCampAuthor = users[0]; // The first user is camp creator

    // ---------------------------------------------------------
    // STEP 2: CREATE 200 CAMPGROUNDS + REVIEWS
    // ---------------------------------------------------------
    for (let i = 0; i < 200; i++) {
        const city = sample(worldCities);

        const camp = new Campground({
            author: mainCampAuthor,
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${city.city}, ${city.country}`,
            description: `Come explore this wonderful location near ${city.city}.`,
            price: Math.floor(Math.random() * 40) + 10,
            geometry: {
                type: "Point",
                coordinates: [city.longitude, city.latitude]
            },
            images: getRandomImages()
        });

        // --- CREATE 2–3 REVIEWS PER CAMPGROUND ---
        const numReviews = Math.floor(Math.random() * 2) + 2;

        for (let j = 0; j < numReviews; j++) {
            const review = new Review({
                body: sample(reviewPhrases),
                rating: Math.floor(Math.random() * 3) + 3,
                author: sample(users) // RANDOM USER from the 3 we created
            });

            await review.save();
            camp.reviews.push(review);
        }

        await camp.save();
    }

    console.log("Seeded 200 campgrounds + reviews + 3 users.");
}
