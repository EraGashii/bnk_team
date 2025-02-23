const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.json()); // ✅ Middleware to parse JSON body
app.use(express.urlencoded({ extended: true })); // Optional: Support URL-encoded bodies
// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Import Routers
const userRouter = require("./routes/userRoutes");
const transactionRouter = require("./routes/transactionsRoutes");
const depositsRouter = require("./routes/depositsRoutes");

// Register Routes
app.use("/user", userRouter);
app.use("/transactions", transactionRouter);
app.use("/deposits", depositsRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({ error: err.errors.map((e) => e.message) });
  }

  res.status(500).json({ error: "Internal Server Error" });
});

// Sync Database and Start Server
db.sequelize.sync({ alter: true }) 
.then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ Failed to sync database:", err);
});

