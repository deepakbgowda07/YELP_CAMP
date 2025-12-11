/**
 * routes/images.js
 * -----------------------------------------------------
 * Handles routes for displaying your image gallery page.
 *
 * NOTE:
 * Currently this route only renders a static view.
 * Useful if:
 *  - You plan to show uploaded images
 *  - You want a separate gallery page
 */

const express = require('express');
const router = express.Router();


/* -----------------------------------------------------
   GET: "/images"
   Render the images index page
------------------------------------------------------ */
/**
 * Renders a simple gallery or placeholder page.
 * The template must exist at: views/images/index.ejs
 */
router.get('/', (req, res) => {
    res.render('images/index');
});


/* -----------------------------------------------------
   EXPORT ROUTER
------------------------------------------------------ */
module.exports = router;
