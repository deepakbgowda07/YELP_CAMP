if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const User = require('../models/user');
const Campground = require('../models/campground');
const Review = require('../models/review');

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const seedUsers = [
    {
        username: 'john_miller',
        email: 'john.miller@example.com',
        password: 'SecurePass123!'
    },
    {
        username: 'sarah_thompson',
        email: 'sarah.thompson@example.com',
        password: 'SecurePass123!'
    },
    {
        username: 'michael_rodriguez',
        email: 'michael.rodriguez@example.com',
        password: 'SecurePass123!'
    },
    {
        username: 'emily_carter',
        email: 'emily.carter@example.com',
        password: 'SecurePass123!'
    },
    {
        username: 'daniel_kim',
        email: 'daniel.kim@example.com',
        password: 'SecurePass123!'
    },
    {
        username: 'olivia_brown',
        email: 'olivia.brown@example.com',
        password: 'SecurePass123!'
    },
    {
        username: 'robert_wilson',
        email: 'robert.wilson@example.com',
        password: 'SecurePass123!'
    },
    {
        username: 'jessica_anderson',
        email: 'jessica.anderson@example.com',
        password: 'SecurePass123!'
    }
];

const campgroundsData = [
    {
        title: 'Pine Ridge Campground',
        description: 'Nestled among towering pines with stunning forest views and peaceful hiking trails.',
        location: 'Asheville, North Carolina',
        price: 45,
        images: [
            { url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80', filename: 'YelpCamp/pine1' },
            { url: 'https://images.unsplash.com/photo-1537225228614-56cc30d1eb5b?w=800&q=80', filename: 'YelpCamp/pine2' },
            { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', filename: 'YelpCamp/pine3' }
        ],
        geometry: { type: 'Point', coordinates: [-82.5597, 35.5951] }
    },
    {
        title: 'Mountain Peak Retreat',
        description: 'High-altitude camping with breathtaking views of the Rocky Mountains and crystal-clear air.',
        location: 'Boulder, Colorado',
        price: 55,
        images: [
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/mountain1' },
            { url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80', filename: 'YelpCamp/mountain2' },
            { url: 'https://images.unsplash.com/photo-1540292026-8f76c277c8fe?w=800&q=80', filename: 'YelpCamp/mountain3' },
            { url: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&q=80', filename: 'YelpCamp/mountain4' }
        ],
        geometry: { type: 'Point', coordinates: [-105.2705, 40.0150] }
    },
    {
        title: 'Lakeside Haven',
        description: 'Direct lake access with sandy beach, perfect for swimming, fishing, and water activities.',
        location: 'Tahoe City, California',
        price: 65,
        images: [
            { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', filename: 'YelpCamp/lake1' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/lake2' },
            { url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', filename: 'YelpCamp/lake3' }
        ],
        geometry: { type: 'Point', coordinates: [-120.1325, 39.1758] }
    },
    {
        title: 'Desert Stars Camp',
        description: 'Remote desert camping with incredible stargazing opportunities and red rock formations.',
        location: 'Moab, Utah',
        price: 40,
        images: [
            { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', filename: 'YelpCamp/desert1' },
            { url: 'https://images.unsplash.com/photo-1532274040911-5f82f20ae318?w=800&q=80', filename: 'YelpCamp/desert2' },
            { url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80', filename: 'YelpCamp/desert3' }
        ],
        geometry: { type: 'Point', coordinates: [-109.5925, 38.5733] }
    },
    {
        title: 'Riverside Sanctuary',
        description: 'Peaceful riverside camping with excellent trout fishing and scenic walking paths.',
        location: 'Sedona, Arizona',
        price: 50,
        images: [
            { url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', filename: 'YelpCamp/river1' },
            { url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80', filename: 'YelpCamp/river2' },
            { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', filename: 'YelpCamp/river3' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/river4' }
        ],
        geometry: { type: 'Point', coordinates: [-111.7597, 34.8697] }
    },
    {
        title: 'Yellowstone Vista',
        description: 'Gateway to Yellowstone National Park with geysers, hot springs, and abundant wildlife viewing.',
        location: 'West Yellowstone, Montana',
        price: 60,
        images: [
            { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80', filename: 'YelpCamp/yellowstone1' },
            { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', filename: 'YelpCamp/yellowstone2' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/yellowstone3' }
        ],
        geometry: { type: 'Point', coordinates: [-111.1147, 44.3894] }
    },
    {
        title: 'Grand Canyon Edge',
        description: 'Premium camping with dramatic canyon views, hiking to natural wonders, and sunset vistas.',
        location: 'Tusayan, Arizona',
        price: 70,
        images: [
            { url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80', filename: 'YelpCamp/canyon1' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/canyon2' },
            { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', filename: 'YelpCamp/canyon3' }
        ],
        geometry: { type: 'Point', coordinates: [-112.0835, 35.9981] }
    },
    {
        title: 'Smoky Mountain Echo',
        description: 'Home to misty mountain peaks, diverse wildlife, and some of the best hiking trails in America.',
        location: 'Gatlinburg, Tennessee',
        price: 48,
        images: [
            { url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80', filename: 'YelpCamp/smoky1' },
            { url: 'https://images.unsplash.com/photo-1537225228614-56cc30d1eb5b?w=800&q=80', filename: 'YelpCamp/smoky2' },
            { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', filename: 'YelpCamp/smoky3' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/smoky4' }
        ],
        geometry: { type: 'Point', coordinates: [-83.3884, 35.7143] }
    },
    {
        title: 'Zion National Oasis',
        description: 'Red rock camping with access to stunning canyons, waterfalls, and biblical landscape formations.',
        location: 'Springdale, Utah',
        price: 62,
        images: [
            { url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80', filename: 'YelpCamp/zion1' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/zion2' },
            { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', filename: 'YelpCamp/zion3' }
        ],
        geometry: { type: 'Point', coordinates: [-112.9868, 37.2202] }
    },
    {
        title: 'Acadia Coastal Camp',
        description: 'Oceanside camping with rugged coastlines, lighthouse views, and fresh maritime breezes.',
        location: 'Bar Harbor, Maine',
        price: 58,
        images: [
            { url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', filename: 'YelpCamp/acadia1' },
            { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', filename: 'YelpCamp/acadia2' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/acadia3' }
        ],
        geometry: { type: 'Point', coordinates: [-68.2008, 44.3876] }
    },
    {
        title: 'Redwood Forest Lodge',
        description: 'Ancient redwood groves towering 350+ feet high, misty forest paths, and peaceful atmosphere.',
        location: 'Eureka, California',
        price: 52,
        images: [
            { url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80', filename: 'YelpCamp/redwood1' },
            { url: 'https://images.unsplash.com/photo-1537225228614-56cc30d1eb5b?w=800&q=80', filename: 'YelpCamp/redwood2' },
            { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', filename: 'YelpCamp/redwood3' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/redwood4' }
        ],
        geometry: { type: 'Point', coordinates: [-124.1626, 40.8021] }
    },
    {
        title: 'Tetons Adventure Base',
        description: 'Alpine camping with jagged mountain peaks, pristine lakes, and world-class mountain scenery.',
        location: 'Jackson, Wyoming',
        price: 68,
        images: [
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/tetons1' },
            { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80', filename: 'YelpCamp/tetons2' },
            { url: 'https://images.unsplash.com/photo-1540292026-8f76c277c8fe?w=800&q=80', filename: 'YelpCamp/tetons3' }
        ],
        geometry: { type: 'Point', coordinates: [-110.7624, 43.4799] }
    },
    {
        title: 'Big Sur Cliff Camp',
        description: 'Dramatic coastal cliffs overlooking the Pacific Ocean with wildlife and rugged natural beauty.',
        location: 'Big Sur, California',
        price: 75,
        images: [
            { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', filename: 'YelpCamp/bigsur1' },
            { url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', filename: 'YelpCamp/bigsur2' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/bigsur3' }
        ],
        geometry: { type: 'Point', coordinates: [-121.8023, 36.2704] }
    },
    {
        title: 'Olympic Peninsula Base',
        description: 'Temperate rainforest camping with moss-covered trees, rushing streams, and lush greenery.',
        location: 'Port Angeles, Washington',
        price: 50,
        images: [
            { url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80', filename: 'YelpCamp/olympic1' },
            { url: 'https://images.unsplash.com/photo-1537225228614-56cc30d1eb5b?w=800&q=80', filename: 'YelpCamp/olympic2' },
            { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', filename: 'YelpCamp/olympic3' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/olympic4' }
        ],
        geometry: { type: 'Point', coordinates: [-123.4307, 48.1081] }
    },
    {
        title: 'Crater Lake Wonder',
        description: 'Pristine alpine lake in an ancient volcanic crater with stunning blue waters and mountain views.',
        location: 'Klamath Falls, Oregon',
        price: 55,
        images: [
            { url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', filename: 'YelpCamp/crater1' },
            { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80', filename: 'YelpCamp/crater2' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/crater3' }
        ],
        geometry: { type: 'Point', coordinates: [-122.1096, 42.9446] }
    },
    {
        title: 'Arches Monument Camp',
        description: 'Otherworldly red rock arches and balanced boulders creating a landscape unlike anywhere else.',
        location: 'Arches, Utah',
        price: 45,
        images: [
            { url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80', filename: 'YelpCamp/arches1' },
            { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', filename: 'YelpCamp/arches2' },
            { url: 'https://images.unsplash.com/photo-1532274040911-5f82f20ae318?w=800&q=80', filename: 'YelpCamp/arches3' }
        ],
        geometry: { type: 'Point', coordinates: [-109.5891, 38.7331] }
    },
    {
        title: 'Glacier Peak Sanctuary',
        description: 'High alpine camping with glaciers, wildflower meadows, and pristine mountain streams.',
        location: 'Kalispell, Montana',
        price: 64,
        images: [
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/glacier1' },
            { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80', filename: 'YelpCamp/glacier2' },
            { url: 'https://images.unsplash.com/photo-1540292026-8f76c277c8fe?w=800&q=80', filename: 'YelpCamp/glacier3' },
            { url: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&q=80', filename: 'YelpCamp/glacier4' }
        ],
        geometry: { type: 'Point', coordinates: [-114.3055, 48.6772] }
    },
    {
        title: 'Carlsbad Caverns Camp',
        description: 'Camping near famous underground caverns with stalactites and stalagmites formations.',
        location: 'Carlsbad, New Mexico',
        price: 42,
        images: [
            { url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80', filename: 'YelpCamp/carlsbad1' },
            { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', filename: 'YelpCamp/carlsbad2' },
            { url: 'https://images.unsplash.com/photo-1532274040911-5f82f20ae318?w=800&q=80', filename: 'YelpCamp/carlsbad3' }
        ],
        geometry: { type: 'Point', coordinates: [-104.4219, 32.1393] }
    },
    {
        title: 'Everglades Wetland Camp',
        description: 'Unique wetland ecosystem camping with alligators, diverse birds, and sawgrass prairies.',
        location: 'Homestead, Florida',
        price: 38,
        images: [
            { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', filename: 'YelpCamp/everglades1' },
            { url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', filename: 'YelpCamp/everglades2' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/everglades3' }
        ],
        geometry: { type: 'Point', coordinates: [-80.4730, 25.4667] }
    },
    {
        title: 'Rocky Mountain Echo',
        description: 'Isolated mountain valley with clear air, quiet nights, and abundant wildlife encounters.',
        location: 'Estes Park, Colorado',
        price: 58,
        images: [
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/echo1' },
            { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80', filename: 'YelpCamp/echo2' },
            { url: 'https://images.unsplash.com/photo-1540292026-8f76c277c8fe?w=800&q=80', filename: 'YelpCamp/echo3' },
            { url: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&q=80', filename: 'YelpCamp/echo4' }
        ],
        geometry: { type: 'Point', coordinates: [-105.5200, 40.3774] }
    },
    {
        title: 'Channel Islands Escape',
        description: 'Remote island camping with sea caves, tide pools, and excellent kayaking opportunities.',
        location: 'Ventura, California',
        price: 72,
        images: [
            { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', filename: 'YelpCamp/islands1' },
            { url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', filename: 'YelpCamp/islands2' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/islands3' }
        ],
        geometry: { type: 'Point', coordinates: [-119.2865, 34.2747] }
    },
    {
        title: 'Badlands Wilderness',
        description: 'Stark prairie landscape with dramatic eroded buttes, fossil beds, and endless horizons.',
        location: 'Wall, South Dakota',
        price: 40,
        images: [
            { url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80', filename: 'YelpCamp/badlands1' },
            { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', filename: 'YelpCamp/badlands2' },
            { url: 'https://images.unsplash.com/photo-1532274040911-5f82f20ae318?w=800&q=80', filename: 'YelpCamp/badlands3' }
        ],
        geometry: { type: 'Point', coordinates: [-102.3372, 43.8864] }
    },
    {
        title: 'Death Valley Extreme',
        description: 'Desert superlative camping with the lowest elevation in North America and salt flats.',
        location: 'Furnace Creek, California',
        price: 48,
        images: [
            { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', filename: 'YelpCamp/deathvalley1' },
            { url: 'https://images.unsplash.com/photo-1532274040911-5f82f20ae318?w=800&q=80', filename: 'YelpCamp/deathvalley2' },
            { url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80', filename: 'YelpCamp/deathvalley3' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/deathvalley4' }
        ],
        geometry: { type: 'Point', coordinates: [-116.8625, 36.5023] }
    },
    {
        title: 'Shenandoah Valley Refuge',
        description: 'Blue Ridge Mountains camping with scenic overlooks, waterfalls, and old-growth forests.',
        location: 'Luray, Virginia',
        price: 46,
        images: [
            { url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80', filename: 'YelpCamp/shenandoah1' },
            { url: 'https://images.unsplash.com/photo-1537225228614-56cc30d1eb5b?w=800&q=80', filename: 'YelpCamp/shenandoah2' },
            { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80', filename: 'YelpCamp/shenandoah3' }
        ],
        geometry: { type: 'Point', coordinates: [-79.0061, 38.5626] }
    },
    {
        title: 'Joshua Tree Mystique',
        description: 'High desert camping with iconic twisted trees, jumbled boulders, and desert rock formations.',
        location: 'Joshua Tree, California',
        price: 50,
        images: [
            { url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80', filename: 'YelpCamp/joshua1' },
            { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', filename: 'YelpCamp/joshua2' },
            { url: 'https://images.unsplash.com/photo-1532274040911-5f82f20ae318?w=800&q=80', filename: 'YelpCamp/joshua3' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/joshua4' }
        ],
        geometry: { type: 'Point', coordinates: [-116.1311, 34.1357] }
    },
    {
        title: 'Mammoth Hot Springs Hideaway',
        description: 'Geothermal camping near colorful hot springs and mineral terraces with unique ecosystem.',
        location: 'Mammoth, Wyoming',
        price: 56,
        images: [
            { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80', filename: 'YelpCamp/mammoth1' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/mammoth2' },
            { url: 'https://images.unsplash.com/photo-1540292026-8f76c277c8fe?w=800&q=80', filename: 'YelpCamp/mammoth3' }
        ],
        geometry: { type: 'Point', coordinates: [-110.8384, 44.9729] }
    },
    {
        title: 'Canyonlands Explorer',
        description: 'Multi-canyon landscape with dramatic rock formations, river canyons, and stunning vistas.',
        location: 'Monticello, Utah',
        price: 52,
        images: [
            { url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80', filename: 'YelpCamp/canyonlands1' },
            { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', filename: 'YelpCamp/canyonlands2' },
            { url: 'https://images.unsplash.com/photo-1532274040911-5f82f20ae318?w=800&q=80', filename: 'YelpCamp/canyonlands3' }
        ],
        geometry: { type: 'Point', coordinates: [-109.3442, 38.2343] }
    },
    {
        title: 'North Cascades Base Camp',
        description: 'Alpine camping with jagged peaks, turquoise lakes, hanging glaciers, and cascading waterfalls.',
        location: 'Marblemount, Washington',
        price: 60,
        images: [
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/cascades1' },
            { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80', filename: 'YelpCamp/cascades2' },
            { url: 'https://images.unsplash.com/photo-1540292026-8f76c277c8fe?w=800&q=80', filename: 'YelpCamp/cascades3' }
        ],
        geometry: { type: 'Point', coordinates: [-122.2281, 48.6797] }
    },
    {
        title: 'Petrified Forest Camp',
        description: 'Camping among ancient petrified wood scattered across colorful badlands and desert plains.',
        location: 'Holbrook, Arizona',
        price: 44,
        images: [
            { url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80', filename: 'YelpCamp/petrified1' },
            { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', filename: 'YelpCamp/petrified2' },
            { url: 'https://images.unsplash.com/photo-1532274040911-5f82f20ae318?w=800&q=80', filename: 'YelpCamp/petrified3' },
            { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', filename: 'YelpCamp/petrified4' }
        ],
        geometry: { type: 'Point', coordinates: [-110.1433, 34.9064] }
    },
    {
        title: 'White Sands Paradise',
        description: 'Unique white gypsum sand dunes creating a otherworldly landscape with sledding opportunities.',
        location: 'Alamogordo, New Mexico',
        price: 46,
        images: [
            { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', filename: 'YelpCamp/whitesands1' },
            { url: 'https://images.unsplash.com/photo-1532274040911-5f82f20ae318?w=800&q=80', filename: 'YelpCamp/whitesands2' },
            { url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80', filename: 'YelpCamp/whitesands3' }
        ],
        geometry: { type: 'Point', coordinates: [-106.3281, 32.7869] }
    }
];

const reviews = [
    {
        body: 'Amazing views and very peaceful at night. Would definitely come back.',
        rating: 5
    },
    {
        body: 'Great location but facilities could be better maintained.',
        rating: 3
    },
    {
        body: 'Fantastic campground with friendly staff and clean bathrooms.',
        rating: 5
    },
    {
        body: 'Decent spot but a bit crowded during weekends.',
        rating: 3
    },
    {
        body: 'Terrible experience. Noisy neighbors and poor management.',
        rating: 1
    },
    {
        body: 'Absolutely stunning scenery. Worth every penny!',
        rating: 5
    },
    {
        body: 'Good location but pricey for what you get.',
        rating: 3
    },
    {
        body: 'Beautiful place but had some issues with wildlife.',
        rating: 2
    },
    {
        body: 'Perfect for families. Lots of activities and safe environment.',
        rating: 5
    },
    {
        body: 'Mediocre experience. Nothing special about this place.',
        rating: 2
    },
    {
        body: 'Incredible sunset views. Definitely recommend to hikers.',
        rating: 5
    },
    {
        body: 'Ok campground, but water facilities were dirty.',
        rating: 2
    },
    {
        body: 'Exceeded expectations! Best camping trip ever.',
        rating: 5
    },
    {
        body: 'Average place. Better options nearby for the price.',
        rating: 2
    },
    {
        body: 'Wonderful experience with amazing trail access.',
        rating: 5
    },
    {
        body: 'The area is beautiful but hard to find parking.',
        rating: 3
    },
    {
        body: 'Would not recommend. Poor conditions overall.',
        rating: 1
    },
    {
        body: 'Spectacular natural beauty and helpful rangers.',
        rating: 5
    },
    {
        body: 'Fine for a quick overnight but nothing memorable.',
        rating: 2
    },
    {
        body: 'Perfect escape from the city noise.',
        rating: 5
    }
];

const seedDB = async () => {
    try {
        await User.deleteMany({});
        await Campground.deleteMany({});
        await Review.deleteMany({});

        const users = [];
        for (const userData of seedUsers) {
            const user = new User({ username: userData.username, email: userData.email });
            const registeredUser = await User.register(user, userData.password);
            users.push(registeredUser);
        }
        console.log('Users seeded');

        const campgrounds = [];
        for (let i = 0; i < campgroundsData.length; i++) {
            const campground = new Campground(campgroundsData[i]);
            campground.author = users[i % users.length]._id;
            await campground.save();
            campgrounds.push(campground);
        }
        console.log('Campgrounds seeded');

        for (let i = 0; i < campgrounds.length; i++) {
            const numReviews = Math.floor(Math.random() * 3) + 2;
            for (let j = 0; j < numReviews; j++) {
                const review = new Review(reviews[Math.floor(Math.random() * reviews.length)]);
                review.author = users[Math.floor(Math.random() * users.length)]._id;
                await review.save();
                campgrounds[i].reviews.push(review._id);
            }
            await campgrounds[i].save();
        }
        console.log('Reviews seeded');

        console.log('Database seeded successfully');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding database:', err);
        mongoose.connection.close();
    }
};

seedDB();
