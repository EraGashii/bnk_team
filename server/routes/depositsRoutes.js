const express = require("express");
const router = express.Router();
const { User, CreditCard, Savings } = require("../models");
const jwt = require('jsonwebtoken')

// Deposit money into savings from a credit card
router.post("/savings", async (req, res) => {
  const token = req.cookies.token; // Get JWT token from cookies

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    const userId = decoded.id; // Extract user ID from the decoded token

    const { creditCardId, amount } = req.body;

    if (!creditCardId || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Find the credit card belonging to this user
    const creditCard = await CreditCard.findOne({ where: { id: creditCardId, userId } });

    if (!creditCard) {
      return res.status(404).json({ error: "Credit card not found" });
    }

    if (creditCard.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Deduct from credit card balance
    creditCard.balance -= amount;
    await creditCard.save();

    // Find or create savings account for the user
    let savings = await Savings.findOne({ where: { userId } });
    if (!savings) {
      savings = await Savings.create({ userId, balance: 0 });
    }

    // Add money to savings
    savings.balance += amount;
    await savings.save();

    return res.json({ message: "Deposit successful", newBalance: savings.balance });
  } catch (error) {
    console.error("Error processing deposit:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/withdraw", async (req, res) => {
  const token = req.cookies.token; // Get JWT token from cookies

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    const userId = decoded.id; // Extract user ID from the decoded token

    const { creditCardId, amount } = req.body;

    if (!creditCardId || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Find the user's savings
    const savings = await Savings.findOne({ where: { userId } });

    if (!savings || savings.balance < amount) {
      return res.status(400).json({ error: "Insufficient savings balance" });
    }

    // Find the credit card
    const creditCard = await CreditCard.findOne({ where: { id: creditCardId, userId } });

    if (!creditCard) {
      return res.status(404).json({ error: "Credit card not found" });
    }

    // Deduct from savings balance
    savings.balance -= amount;
    await savings.save();

    // Add money back to the credit card balance
    creditCard.balance += amount;
    await creditCard.save();

    return res.json({
      message: "Withdrawal successful",
      newSavingsBalance: savings.balance,
      newCreditCardBalance: creditCard.balance,
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get the total amount saved by the logged-in user
router.get("/totalDeposits", async (req, res) => {
  const token = req.cookies.token; // Extract token from cookies

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    const userId = decoded.id; // Extract userId from decoded token

    // Fetch total deposits for the logged-in user
    const savings = await Savings.findOne({ where: { userId } });

    if (!savings) {
      return res.json({ totalDeposits: 0 }); // Return 0 if user has no savings
    }

    return res.json({ totalDeposits: savings.balance });
  } catch (error) {
    console.error("Error fetching total deposits:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/getSavings", async (req, res) => {
  const token = req.cookies.token; // Extract JWT from cookies

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    const userId = decoded.id; // Extract userId from decoded token

    // Fetch savings balance for the logged-in user
    const savings = await Savings.findOne({ where: { userId } });

    if (!savings) {
      return res.json({ balance: 0 }); // If no savings exist, return 0
    }

    return res.json({ balance: savings.balance });
  } catch (error) {
    console.error("Error fetching savings balance:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
