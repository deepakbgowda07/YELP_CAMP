# 🌲 YelpCamp
### A Full-Stack Campground Discovery & Review Platform

<p align="center">
  <b>Create • Explore • Review • Share Campgrounds</b>
</p>

---

# 🎥 Project Demo

<p align="center">
  <img src="assets\YELP.gif" alt="YelpCamp Demo" width="100%">
</p>

> 📌 **Tip:** Replace `assets/demo.gif` with the path to your GIF.

---

## 📖 About the Project

YelpCamp is a full-stack web application where users can discover, create, review, and manage campgrounds from around the world. It provides a complete campground management experience with secure authentication, interactive maps, image uploads, and a responsive user interface.

The project was built to strengthen full-stack development skills by implementing authentication, RESTful architecture, cloud storage, geolocation services, server-side validation, and CRUD operations in a production-like environment.

---

## ✨ Features

### 🏕 Campground Management
- Create, edit, and delete campgrounds
- Upload multiple campground images
- Interactive location selection using MapTiler
- Server-side validation using Joi

### ⭐ Reviews & Ratings
- Add and delete campground reviews
- Star-based rating system
- Review validation

### 👤 Authentication & Authorization
- User Registration & Login
- Secure password hashing using Passport.js
- Authorization for campground ownership
- Protected routes

### 🗺 Interactive Maps
- Cluster map displaying all campgrounds
- Individual campground map
- Geocoding & Reverse Geocoding
- Dynamic map markers

### 🖼 Modern UI
- Fully responsive design
- Bootstrap 5
- Flash notifications
- Interactive cards & image galleries
- Clean user experience

---

# 📸 Screenshots

| Home Page | Campground Details |
|------------|--------------------|
| Add Screenshot | Add Screenshot |

| Create Campground | Cluster Map |
|-------------------|-------------|
| Add Screenshot | Add Screenshot |

---

# 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | Passport.js, Passport Local |
| **Image Storage** | Cloudinary, Multer |
| **Validation** | Joi |
| **Maps & Geocoding** | MapTiler SDK |
| **Frontend** | EJS, Bootstrap 5 |
| **Deployment** | Render / Railway / Heroku |

---

# 📂 Project Structure

```text
YELP_CAMP/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── schemas.js
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── views/
│   ├── campgrounds/
│   ├── users/
│   ├── layouts/
│   └── partials/
├── utils/
├── cloudinary/
├── app.js
├── package.json
└── README.md
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/deepakbgowda07/YELP_CAMP.git
```

Navigate into the project

```bash
cd YELP_CAMP
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
DB_URL=YOUR_MONGODB_CONNECTION_STRING

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_KEY=YOUR_API_KEY
CLOUDINARY_SECRET=YOUR_API_SECRET

MAPTILER_API_KEY=YOUR_MAPTILER_KEY

SECRET=YOUR_SESSION_SECRET
```

Run the application

```bash
npm start
```

Visit:

```
http://localhost:3000
```

---

# 🔒 Authentication Flow

- User Registration
- Login
- Session Management
- Route Protection
- Authorization Middleware
- Secure Password Hashing

---

# 🌟 Key Learning Outcomes

- RESTful Routing
- MVC Architecture
- Authentication & Authorization
- Session & Cookie Management
- File Uploads with Cloudinary
- Server-side Validation
- Interactive Maps & Geocoding
- CRUD Operations
- Error Handling
- Responsive UI Design

---

# 🚀 Future Improvements

- Social Login (Google / GitHub)
- Bookmark Favorite Campgrounds
- User Profiles
- Advanced Search & Filters
- Infinite Scrolling
- Notifications
- Admin Dashboard
- Dark Mode

---

# 👨‍💻 Author

**Deepak B Gowda**

- 💼 LinkedIn: https://linkedin.com/in/deepakbgowda
- 📧 Email: your-email@example.com

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.