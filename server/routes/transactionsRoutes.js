const express = require('express');
const router = express.Router();
const { User, Transaction } = require('../models');
// const authenticateToken = require('../middleware/auth');

// Apply middleware to all routes in this file
// router.use(authenticateToken);

// Get all transactions (for the authenticated user)
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }],
      },
      include: [
        { model: User, as: 'Sender', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'Receiver', attributes: ['id', 'name', 'email'] },
      ],
    });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new transaction
router.post('/', async (req, res) => {
  const { senderId, receiverId, amount } = req.body;

  try {
    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Sender and receiver cannot be the same' });
    }

    const sender = await User.findByPk(senderId);
    const receiver = await User.findByPk(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'Sender or Receiver not found' });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Update balances
    await sender.update({ balance: sender.balance - amount });
    await receiver.update({ balance: receiver.balance + amount });

    // Create the transaction
    const transaction = await Transaction.create({
      senderId,
      receiverId,
      amount,
      status: 'completed',
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
