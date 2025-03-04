const express = require('express');
const router = express.Router();
const { Transaction, CreditCard, User } = require('../models');

// Create a new transaction (POST)
router.post('/', async (req, res) => {
  const { senderCardId, receiverCardId, amount } = req.body;

  try {
    const transaction = await Transaction.create({
      senderCardId,
      receiverCardId,
      amount,
      status: 'pending',
    });
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
