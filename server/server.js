const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./models');
const authenticateToken = require('./middleware/auth'); // Import the authentication middleware

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(cors({
  origin: 'http://localhost:3000', // Update with your frontend's origin
  credentials: true, // Allow credentials like cookies
}));

// Routers
const userRouter = require('./routes/userRoutes');
const transactionRouter = require('./routes/transactionsRoutes');

// Apply authentication middleware globally (except for public routes)
app.use((req, res, next) => {
  // Skip authentication for public routes like login and register
  if (['/user/login', '/user/register'].includes(req.path)) {
    return next();
  }
  authenticateToken(req, res, next);
});

// Route definitions
app.use('/user', userRouter);
app.use('/transactions', transactionRouter);

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
