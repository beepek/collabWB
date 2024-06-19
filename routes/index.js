// routes/index.js
const express = require('express');
const router = express.Router();

// Root route
router.get('/', (req, res) => {
    res.send('Welcome to the Collaborative Whiteboard App!');
});


router.get('/about', (req, res) => {
    res.send('About the Collaborative Whiteboard App');
});

module.exports = router;
