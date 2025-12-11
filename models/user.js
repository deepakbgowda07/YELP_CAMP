/**
 * models/user.js
 * -----------------------------------------------------
 * Represents an authenticated user in the YelpCamp app.
 *
 * This schema integrates with passport-local-mongoose, which:
 *  - Adds username field automatically
 *  - Handles password hashing + salting
 *  - Adds authentication helper methods
 *
 * Fields stored in the database:
 *  - email (String)
 *  - username (auto-added by passport-local-mongoose)
 *  - hashed password (auto-generated, not manually stored)
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Plugin that adds username, hash, salt, and auth helpers
const passportLocalMongoose = require('passport-local-mongoose');


/* -----------------------------------------------------
   USER SCHEMA
------------------------------------------------------ */
/**
 * Defines additional fields for the user.
 *
 * Note:
 * passport-local-mongoose automatically adds:
 *  - username
 *  - hash (encrypted password)
 *  - salt
 */
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // no two users can use the same email
    }
});


/* -----------------------------------------------------
   PASSPORT-LOCAL-MONGOOSE PLUGIN
------------------------------------------------------ */
/**
 * Adds:
 *  - username field to schema
 *  - setPassword(), authenticate(), serializeUser(), etc.
 *  - automatic password hashing and validation
 */
UserSchema.plugin(passportLocalMongoose);


/* -----------------------------------------------------
   MODEL EXPORT
------------------------------------------------------ */
module.exports = mongoose.model('User', UserSchema);
