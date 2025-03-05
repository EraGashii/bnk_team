const express = require('express');
const router = express.Router();
const { Transaction, CreditCard, User } = require('../models');
const jwt = require('jsonwebtoken');

// Create a new transaction using card numbers
router.post("/", async (req, res) => {
  console.log("Incoming Cookies:", req.cookies); // ✅ Debugging step

  const token = req.cookies.token; // ✅ Get token from cookies, not headers

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

    // Get sender's credit card
    const senderCard = await CreditCard.findOne({ where: { userId: decoded.id } });
    if (!senderCard) {
      return res.status(400).json({ error: "No credit card found for user" });
    }

    // Get receiver's credit card
    const { receiverCardNumber, amount, reason } = req.body;
    const receiverCard = await CreditCard.findOne({ where: { cardNumber: receiverCardNumber } });
    if (!receiverCard) {
      return res.status(400).json({ error: "Receiver card not found" });
    }

    // Check if sender has enough balance
    if (senderCard.balance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    // Deduct from sender, add to receiver
    senderCard.balance -= amount;
    receiverCard.balance += amount;

    // Save updated balances
    await senderCard.save();
    await receiverCard.save();

    // Create transaction
    const transaction = await Transaction.create({
      senderCardId: senderCard.id,
      receiverCardId: receiverCard.id,
      amount,
      reason,
      status: "completed", // Mark transaction as completed
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Read all transactions (GET)
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: CreditCard, as: 'SenderCard', include: [{ model: User, as: 'User' }] },
        { model: CreditCard, as: 'ReceiverCard', include: [{ model: User, as: 'User' }] },
      ],
    });

    if (!transactions.length) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New Route: Get Transaction History with Custom Formatting
router.get('/history', async (req, res) => {
  try {
    const transactions = await Transaction.findAll();

    const formattedData = transactions.map(transaction => ({
      name: `Transaction #${transaction.id}`,
      amount: transaction.amount
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get("/getcc", async (req, res) => {
  console.log("Incoming Cookies:", req.cookies); // ✅ Check if token is received

  const token = req.cookies.token; // ✅ Read token from cookies, not headers
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

    const creditCard = await CreditCard.findOne({ where: { userId: decoded.id } });

    if (!creditCard) {
      return res.status(404).json({ error: "No credit card found for this user" });
    }

    res.json(creditCard);
  } catch (error) {
    console.error("Error fetching user's credit card:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Read a single transaction by ID (GET)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findByPk(id, {
      include: [
        { model: CreditCard, as: 'SenderCard', include: [{ model: User, as: 'User' }] },
        { model: CreditCard, as: 'ReceiverCard', include: [{ model: User, as: 'User' }] },
      ],
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a transaction (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await transaction.update({ status });
    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a transaction (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await transaction.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
