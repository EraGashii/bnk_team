const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json()); // Middleware to parse JSON body
app.use(express.urlencoded({ extended: true })); // Support URL-encoded bodies
app.use(
  cors({
    origin: "*",  // Allow all origins (for testing only)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

// ✅ Import Routers
const userRouter = require("./routes/userRoutes");
const transactionsRoutes = require('./routes/transactionsRoutes');
const depositsRouter = require("./routes/depositsRoutes");
const authRoutes = require('./routes/auth');
const adminRoutes = require("./routes/adminRoutes");
const taxRoutes = require("./routes/taxPaymentsRoutes");
const teamPlayerRoutes = require("./routes/teamPlayersRoutes");
const employeeRoutes =require("./routes/employeeRoutes");
const LigjerataRoutes =require("./routes/LigjerataRoutes")
const PlanetRoutes =require("./routes/")

// ✅ Register Routes  
app.use("/user", userRouter);
app.use('/transactions', transactionsRoutes);
app.use("/deposit", depositsRouter);
app.use('/auth', authRoutes);
app.use("/admin", adminRoutes);
app.use("/tax", taxRoutes);  // ✅ Ensure /api is used
app.use("/api", teamPlayerRoutes);
app.use("/api",employeeRoutes);
app.use("/api",LigjerataRoutes)

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({ error: err.errors.map((e) => e.message) });
  }
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Sync Database and Start Server
db.sequelize.sync({ alter: true }) 
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to sync database:", err);
  });
