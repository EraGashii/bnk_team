const express = require('express');
const router = express.Router();
const { Deposit, CreditCard } = require('../models');
const authenticateToken = require('../middleware/auth'); // Import your middleware

// GET all deposits for a specific credit card
router.get('/creditCard/:creditCardId', authenticateToken, async (req, res) => {
  const creditCardId = req.params.creditCardId;
  try {
    const deposits = await Deposit.findAll({
      where: {
        creditCardId: creditCardId // Fetch by creditCardId
      }
    });
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all deposits (for Admin)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const deposits = await Deposit.findAll({
      include: [{ model: CreditCard, attributes: ['id', 'cardNumber', 'balance'] }] // Include credit card details
    });

    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new deposit
router.post("/", authenticateToken, async (req, res) => {
  const { creditCardId, amount, method, date } = req.body;

  try {
    // Create a new deposit
    const newDeposit = await Deposit.create({
      creditCardId,  // Link to the Credit Card
      amount,
      method,
      date,
      status: 'Pending'
    });

    // Get the related credit card
    const creditCard = await CreditCard.findByPk(creditCardId);

    if (!creditCard) {
      return res.status(404).json({ message: 'Credit card not found' });
    }

    // Update the credit card's balance
    creditCard.balance += amount;  // Add deposit amount to the balance
    await creditCard.save();  // Save the updated credit card

    res.status(201).json(newDeposit);  // Respond with the new deposit
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a deposit
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deposit = await Deposit.findByPk(req.params.id);
    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }
    await deposit.destroy();
    res.json({ message: "Deposit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
