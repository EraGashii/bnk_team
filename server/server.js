const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./models');

const authenticateToken = require('./middleware/auth'); // Import authentication middleware

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));

// Import Routers
const userRouter = require('./routes/userRoutes');
const transactionRouter = require('./routes/transactionsRoutes');
const depositsRouter = require('./routes/depositsRoutes');  // ✅ Added Deposits
const transfersRouter = require('./routes/transfersRoutes'); // ✅ Added Transfers

// Apply authentication middleware globally (except for public routes)
app.use((req, res, next) => {
  if (['/user/login', '/user/register'].includes(req.path)) {
    return next(); // Skip authentication for login and register
  }
  authenticateToken(req, res, next);
});

// Register Routes
app.use('/user', userRouter);
app.use('/transactions', transactionRouter);
app.use('/deposits', depositsRouter);    // ✅ Register Deposits Route
app.use('/transfers', transfersRouter);  // ✅ Register Transfers Route

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Sync Database and Start Server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`> Listening on port ${PORT}`);
  });
});
