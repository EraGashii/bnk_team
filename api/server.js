const express = require('express');
const db = require('./models/');
const cors = require('cors');
const app = express();

const PORT = 3001;


// Parse JSON request
app.use(express.json());

// Whitelist aPI
app.use(cors());

// User Router
const userRouter = require('./routes/UserRoute');
app.use('/', userRouter);


db.sequelize.sync().then( () => {
  app.listen(PORT, 'localhost', () => {
    console.log(">Listening on port 3001");

  })
})
