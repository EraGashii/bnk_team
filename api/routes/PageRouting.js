const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

router.get('/home', authenticateToken, (req, res) => {
  res.json({
    message: 'Welcome to the home page!',
    user: req.user, 
  });
});

module.exports = router;
