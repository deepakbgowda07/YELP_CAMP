const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const User = require('../models/user');

mongoose.connect('mongodb://127.0.0.1:27017/yelpdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    let user = await User.findOne({ email: 'seed@seed.com' });
    if (!user) {
        user = new User({ email: 'seed@seed.com', username: 'seeduser' });
        await User.register(user, 'password');
    }
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
         const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
                        author: user._id,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
               title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://picsum.photos/800/600?random=' + i,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})