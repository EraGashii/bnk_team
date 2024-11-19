const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Routers
const userRouter = require('./routes/UserRoute');
const transactionRouter = require('./routes/TransactionRoute');

app.use('/user', userRouter);
app.use('/transactions', transactionRouter);

// Sync and Start Server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`> Listening on port ${PORT}`);
  });
});
