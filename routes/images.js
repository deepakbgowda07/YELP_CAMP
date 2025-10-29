const express = require('express');
const router = express.Router();

// =======================
// INDEX - Show all images
// =======================
router.get('/', (req, res) => {
    res.render('images/index');
});

module.exports = router;
