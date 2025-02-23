const express = require('express');
const router = express.Router();
const { User, CreditCard, Transaction } = require('../models');
const { Op } = require("sequelize");
// const authenticateToken = require('../middleware/auth');

// // Apply middleware to all routes in this file
// router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
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

  console.log(">Transaction route has been called");
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


// Deposit route, uses Credit Card IDS, if you need to test, just create a user so it generates a new credit card and then use this api to deposit funds to the card.
router.post('/deposit', async (req, res) => {
  const {cardId, amount} = req.body;

  try {

    const creditCard = await CreditCard.findByPk(cardId);
    if (!creditCard) {
      return res.status(404).json({error: 'Credit card not found'});
    }

    if (amount <= 0) {
      return res.status(400).json({error: 'Deposit amount must be higher than 0'});
    }

    await creditCard.update({balance: creditCard.balance + amount});
    
    res.status(200).json({
      message: 'Deposit successful',
      card: {
        id: creditCard.id,
        balance: creditCard.balance,
      }

    });
   } catch(error) {

      console.error('Error depositing funds:', error);
      res.status(500).json({error: 'Internal Server Error'});
  }

})

module.exports = router;
