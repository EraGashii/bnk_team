const express = require("express");
const router = express.Router();
const { TaxPayment, CreditCard, Transaction } = require("../models");
const jwt = require("jsonwebtoken");

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized - No token provided" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Handle Tax Payment via Transaction System
router.post("/", authenticateUser, async (req, res) => {
  const { taxName, amount, dueDate, recipientCardNumber } = req.body;

  try {
    // Retrieve the logged-in user's credit card
    const senderCard = await CreditCard.findOne({ where: { userId: req.user.id } });

    if (!senderCard) {
      return res.status(404).json({ error: "No credit card found for this user" });
    }

    // Retrieve the recipient's credit card (to which tax payment is made)
    const receiverCard = await CreditCard.findOne({ where: { cardNumber: recipientCardNumber } });

    if (!receiverCard) {
      return res.status(404).json({ error: "Recipient credit card not found" });
    }

    // Check if user has sufficient balance
    if (senderCard.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance for tax payment" });
    }

    // Deduct from sender and add to receiver
    senderCard.balance -= amount;
    receiverCard.balance += amount;

    await senderCard.save();
    await receiverCard.save();

    // Create transaction record
    const transaction = await Transaction.create({
      senderCardId: senderCard.id,
      receiverCardId: receiverCard.id,
      amount,
      reason: `Tax Payment - ${taxName}`,
      status: "completed",
    });

    // Create tax payment record linked to the transaction
    const taxPayment = await TaxPayment.create({
      userId: req.user.id,
      taxName,
      amount,
      dueDate,
      creditCardNumber: recipientCardNumber,
      status: "paid",
      transactionId: transaction.id, // Linking transaction
    });

    res.status(201).json({
      message: "Tax payment successful",
      taxPayment,
      transaction,
      remainingBalance: senderCard.balance,
    });
  } catch (error) {
    console.error("Error processing tax payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
