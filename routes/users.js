/**
 * routes/users.js
 * -----------------------------------------------------
 * Handles user authentication routes:
 *  - Register
 *  - Login
 *  - Logout
 *
 * Uses Passport for authentication and session management.
 */

const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

const users = require('../controllers/users');
const { validateUser } = require('../middleware');


/* -----------------------------------------------------
   REGISTER ROUTES
------------------------------------------------------ */
/**
 * GET  /register   → Render registration form
 * POST /register   → Create new user account
 *
 * catchAsync() handles errors inside async controllers.
 */
router.route('/register')
    .get(users.renderRegister)
    .post(validateUser, catchAsync(users.register));

/* -----------------------------------------------------
   LOGIN ROUTES
------------------------------------------------------ */
/**
 * GET  /login    → Render login form
 * POST /login    → Authenticate user
 *
 * passport.authenticate('local'):
 *  - Validates username + password
 *  - failureFlash: shows error message on failure
 *  - failureRedirect: redirects back to /login
 *
 * On success → moves to users.login controller.
 */
router.route('/login')
    .get(users.renderLogin)
    .post(
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login'
        }),
        users.login
    );


/* -----------------------------------------------------
   LOGOUT ROUTE
------------------------------------------------------ */
/**
 * GET /logout → Logs out current user
 */
router.get('/logout', users.logout);


/* -----------------------------------------------------
   EXPORT ROUTER
------------------------------------------------------ */
module.exports = router;
