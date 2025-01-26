const express = require('express');
const router = express.Router();
const { User, CreditCard, Transaction } = require('../models');
const authenticateToken = require('../middleware/auth');

// Apply middleware to all routes in this file
router.use(authenticateToken);

// Get all transactions (for the authenticated user)
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [
          { '$SenderCard.userId$': req.user.id },
          { '$ReceiverCard.userId$': req.user.id }
        ]
      },
      include: [
        { model: CreditCard, as: 'SenderCard', include: [{ model: User, as: 'User' }] },
        { model: CreditCard, as: 'ReceiverCard', include: [{ model: User, as: 'User' }] }
      ]
    });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new transaction
router.post('/', async (req, res) => {
  const { senderCardId, receiverCardId, amount } = req.body;

  try {
    if (senderCardId === receiverCardId) {
      return res.status(400).json({ error: 'Sender and receiver cannot be the same' });
    }

    const senderCard = await CreditCard.findByPk(senderCardId);
    const receiverCard = await CreditCard.findByPk(receiverCardId);

    if (!senderCard || !receiverCard) {
      return res.status(404).json({ error: 'Sender or Receiver card not found' });
    }

    if (senderCard.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Update balances
    await senderCard.update({ balance: senderCard.balance - amount });
    await receiverCard.update({ balance: receiverCard.balance + amount });

    // Create the transaction
    const transaction = await Transaction.create({
      senderCardId,
      receiverCardId,
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
