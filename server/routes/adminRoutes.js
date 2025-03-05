const express = require("express");
const router = express.Router();
const { User, Transaction, CreditCard, sequelize} = require("../models");
const jwt = require("jsonwebtoken");
const { Op, fn, col} = require("sequelize");

// Middleware to check if the user is an admin
const authenticateAdmin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

    if (decoded.role !== "Admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// 📌 Get total users count
router.get("/total-users", authenticateAdmin, async (req, res) => {
  try {
    const totalUsers = await User.count();
    res.json({ totalUsers });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Get new users registered this week
router.get("/new-users", authenticateAdmin, async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newUsers = await User.count({
      where: {
        createdAt: { [Op.gte]: oneWeekAgo }, // Users created within the last 7 days
      },
    });

    res.json({ newUsers });
  } catch (error) {
    console.error("Error fetching new users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Get total deposits from transactions in the past 7 days
router.get("/total-deposits", authenticateAdmin, async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Subtract 7 days

    const totalDeposits = await Transaction.sum("amount", {
      where: {
        createdAt: { [Op.gte]: oneWeekAgo }, // Transactions in the past 7 days
      },
    });

    res.json({ totalDeposits: totalDeposits || 0 });
  } catch (error) {
    console.error("Error fetching total deposits:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Get recent transactions (last 10)
router.get("/recent-transactions", authenticateAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [["createdAt", "DESC"]],
      limit: 10, // Get last 10 transactions
    });

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// 📌 Get total transactions count
router.get("/total-transactions", authenticateAdmin, async (req, res) => {
  try {
    const totalTransactions = await Transaction.count();
    res.json({ totalTransactions });
  } catch (error) {
    console.error("Error fetching total transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Get active users count
router.get("/active-users", authenticateAdmin, async (req, res) => {
  try {
    const activeUsers = await User.count({ where: { status: "Active" } });
    res.json({ activeUsers });
  } catch (error) {
    console.error("Error fetching active users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Get monthly transaction volume (for chart)
router.get("/monthly-transactions", authenticateAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      attributes: [
        [sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
      ],
      group: [sequelize.fn("MONTH", sequelize.col("createdAt"))],
      order: [[sequelize.fn("MONTH", sequelize.col("createdAt")), "ASC"]],
    });

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching monthly transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Get all transactions (with sender and receiver details)
router.get("/transactions", authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const whereCondition = status ? { status } : {};

    const transactions = await Transaction.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: CreditCard,
          as: "SenderCard",
          attributes: ["cardNumber"],
          include: [{ model: User, attributes: ["name", "surname"] }],
        },
        {
          model: CreditCard,
          as: "ReceiverCard",
          attributes: ["cardNumber"],
          include: [{ model: User, attributes: ["name", "surname"] }],
        },
      ],
    });

    if (!transactions) {
      return res.json([]); // Return an empty array if no transactions are found
    }

    // Format response
    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      senderCardId: transaction.senderCardId,
      senderCardNumber: transaction.SenderCard?.cardNumber || "N/A",
      senderName: transaction.SenderCard?.User
        ? `${transaction.SenderCard.User.name} ${transaction.SenderCard.User.surname}`
        : "Unknown",
      receiverCardId: transaction.receiverCardId,
      receiverCardNumber: transaction.ReceiverCard?.cardNumber || "N/A",
      receiverName: transaction.ReceiverCard?.User
        ? `${transaction.ReceiverCard.User.name} ${transaction.ReceiverCard.User.surname}`
        : "Unknown",
      amount: transaction.amount,
      status: transaction.status,
      createdAt: transaction.createdAt,
    }));

    res.json(formattedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json([]); // Ensure the response is always an array
  }
});

module.exports = router;
