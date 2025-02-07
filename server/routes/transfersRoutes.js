const express = require("express");
const router = express.Router();
const db = require("../models"); // Sequelize or your database connection

// Get all transfers
router.get("/", async (req, res) => {
  try {
    const transfers = await db.Transfer.findAll(); // Fetch transfers from DB
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
