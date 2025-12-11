/**
 * cloudinary/index.js
 * -----------------------------------------------------
 * This module configures Cloudinary and sets up the
 * Multer storage engine used for uploading images.
 *
 * Responsibilities:
 *  - Load Cloudinary credentials from environment variables
 *  - Authenticate Cloudinary API
 *  - Configure Multer Storage to upload images into
 *    a specific Cloudinary folder
 */

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

/* -----------------------------------------------------
   CLOUDINARY CONFIGURATION
------------------------------------------------------ */
/**
 * Configure Cloudinary using environment variables.
 * These must be defined in your .env file:
 *
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_KEY
 * - CLOUDINARY_SECRET
 *
 * If not present, uploads will fail.
 */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


/* -----------------------------------------------------
   MULTER STORAGE CONFIGURATION
------------------------------------------------------ */
/**
 * CloudinaryStorage integrates Multer with Cloudinary.
 *
 * Settings:
 * - folder: specifies the folder where images will be stored
 * - allowedFormats: restricts file types for upload
 *
 * NOTE:
 * You requested no logic changes — so this configuration
 * remains identical to your original implementation.
 */
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',               // Cloudinary folder name
        allowedFormats: ['jpeg', 'png', 'jpg'] // Allowed image types
    }
});


/* -----------------------------------------------------
   EXPORTS
------------------------------------------------------ */
module.exports = {
    cloudinary,  // Used when deleting images or accessing Cloudinary API
    storage      // Used in Multer middleware for handling uploads
};
