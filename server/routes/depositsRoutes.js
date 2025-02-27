const express = require('express');
const router = express.Router();
const { Deposit } = require('../models');
const authenticateToken = require('../middleware/auth'); // Import your middleware

// GET all deposits for a specific user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const deposits = await Deposit.findAll({
      where: {
        userId: req.params.userId
      }
    });
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new deposit
router.post('/', authenticateToken, async (req, res) => {
  const { userId, amount, method, date } = req.body;
  try {
    const newDeposit = await Deposit.create({
      userId,
      amount,
      method,
      date,
      status: 'Pending'
    });
    res.status(201).json(newDeposit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a deposit
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deposit = await Deposit.findByPk(req.params.id);
    if (!deposit) {
      return res.status(404).json({ message: 'Deposit not found' });
    }
    await deposit.destroy();
    res.json({ message: 'Deposit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
