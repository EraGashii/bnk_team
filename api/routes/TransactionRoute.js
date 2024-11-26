const express = require('express');
const router = express.Router();
const authenticateMiddleware = require('../middleware/authMiddleware');
const { User, Transaction } = require('../models');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
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



router.post('/deposit', authenticateMiddleware, async (req, res) => {
  const { amount } = req.body;

  try {
    const userId = req.user.id;

    if (amount <= 0) {
      return res.status(400).json({error: 'Deposit amount cannot be a negative number or 0'});
    }

    const user = await User.findByPk(userId);
    if(!user) {
      return res.status(400).json({error: 'User ID not found'});
    }

    user.balance += parseFloat(amount);
    await user.save();


    res.status(200).json({
      message: 'Deposit was successful',
      balance: user.balance
    });


  }
  catch (err) {
    console.error('Error during deposit, server?', err);
    res.status(501).json({err: 'Internal Server Error'});
  }
})

module.exports = router;
