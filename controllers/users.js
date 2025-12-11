/**
 * controllers/users.js
 * -----------------------------------------------------
 * Handles all authentication-related operations:
 *  - Rendering register/login forms
 *  - Registering new users
 *  - Logging users in
 *  - Logging users out
 *
 * Passport (passport-local-mongoose) handles:
 *  - Password hashing
 *  - Auth helpers (User.register, req.login, req.logout)
 */

const User = require('../models/user');


/* -----------------------------------------------------
   GET: Render registration form
------------------------------------------------------ */
/**
 * Displays the user registration form.
 */
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};


/* -----------------------------------------------------
   POST: Register a new user
------------------------------------------------------ */
/**
 * Creates a new user account.
 *
 * Steps:
 *  1. Extract email, username, password from form data.
 *  2. Create a User instance with email + username.
 *  3. Use User.register() to hash the password and save the user.
 *  4. Automatically log the user in after successful registration.
 *  5. Redirect to campgrounds with a welcome message.
 *
 * If an error occurs (e.g., duplicate username):
 *  - Flash the error message
 *  - Redirect back to /register
 */
module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;

        // Create a new user with email & username
        const user = new User({ email, username });

        // Passport-local-mongoose handles hashing + saving
        const registeredUser = await User.register(user, password);

        // Automatically log in the user after registration
        req.login(registeredUser, err => {
            if (err) return next(err);

            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });

    } catch (e) {
        // Example: "A user with the given username is already registered"
        req.flash('error', e.message);
        res.redirect('register');
    }
};


/* -----------------------------------------------------
   GET: Render login form
------------------------------------------------------ */
/**
 * Displays the login form.
 */
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};


/* -----------------------------------------------------
   POST: Log user in
------------------------------------------------------ */
/**
 * Called after successful passport authentication.
 *
 * Steps:
 *  1. Flash "welcome back" message
 *  2. Redirect user back to the page they originally tried to visit
 *     (stored in req.session.returnTo)
 *  3. Default redirect: /campgrounds
 */
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');

    // Redirect to stored URL or fallback
    const redirectUrl = req.session.returnTo || '/campgrounds';

    // Cleanup the stored return URL
    delete req.session.returnTo;

    res.redirect(redirectUrl);
};


/* -----------------------------------------------------
   GET: Log user out
------------------------------------------------------ */
/**
 * Logs the user out using Passport's req.logout method.
 *
 * The callback structure is required in modern Passport versions.
 */
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);

        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
};
