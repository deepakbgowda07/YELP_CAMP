# 🌲 YelpCamp — Full-Stack Campground Review Application  
A full-featured CRUD application where users can create, edit, review, and explore campgrounds on an interactive map. Built using **Node.js, Express, MongoDB, Passport Authentication, Cloudinary**, and **MapTiler Maps**.

![YelpCamp Banner](https://images.unsplash.com/photo-1458442310124-dde6edb43d10?w=1600&q=80)

---

## 🚀 Features

### 🏕 Campgrounds
- Create, edit, delete campgrounds  
- Upload images using **Cloudinary**  
- Integrated map display using **MapTiler SDK**  
- Server-side validation using **Joi**

### ⭐ Reviews
- Add and delete reviews  
- Star-based rating UI  
- Validation for review content

### 👤 Authentication
- Register / Login / Logout  
- Secure password hashing via **passport-local-mongoose**  
- Strong backend validation for email + password

### 🗺 Maps + Geocoding
- Interactive cluster map on the index page  
- Draggable marker on create/edit pages  
- Reverse + forward geocoding with MapTiler  
- Single campground map popup

### 🖼 UI
- Fully responsive layout  
- Bootstrap 5 styling  
- Beautiful carousels, cards, alerts  
- Custom CSS enhancements

---

## 🛠 Tech Stack

| Category | Technology |
|---------|------------|
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Authentication | Passport.js |
| Image Upload | Cloudinary + Multer |
| Validation | Joi |
| Maps | MapTiler SDK + Geocoding |
| Frontend | EJS Templates + Bootstrap 5 |
| Deployment | (Optional: Render, Railway, Heroku) |

---
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

MAPTILER_API_KEY=your_maptiler_key

DB_URL=mongodb://127.0.0.1:27017/yelp-camp
SECRET=your_session_secret




git clone https://github.com/deepakbgowda07/YELP_CAMP.git
cd YELP_CAMP

YELP_CAMP/
│
├── app.js                # Main Express app
├── .env                  # Env variables
├── package.json          # Dependencies
│
├── models/               # Mongoose models
│   ├── campground.js
│   ├── review.js
│   └── user.js
│
├── controllers/          # Route logic
│   ├── campground.js
│   ├── review.js
│   └── users.js
│
├── routes/               # Express routers
│   ├── campground.js
│   ├── review.js
│   └── users.js
│
├── public/               # Static assets
│   ├── javascripts/
│   │   ├── clusterMap.js
│   │   ├── showPageMap.js
│   │   ├── formMap.js
│   │   └── validateForms.js
│   ├── stylesheets/
│   │   ├── app.css
│   │   ├── home.css
│   │   └── stars.css
│
├── views/                # EJS templates
│   ├── campgrounds/
│   ├── layouts/
│   ├── partials/
│   └── users/
│
└── utils/                # Utilities
    ├── catchAsync.js
    └── ExpressError.js




