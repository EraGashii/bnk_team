const express = require('express');
const router = express.Router();
const db = require('../models');

// GET all deposits
router.get('/', async (req, res) => {
  try {
    const deposits = await db.Deposit.findAll();  // Fetch all deposits from DB
    res.json(deposits);  // Return deposits as JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
