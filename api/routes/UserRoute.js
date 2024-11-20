const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret_key';


// All users (testing purposes)
router.get('/', async (req, res) => {
  const listAllUsers = await User.findAll();
  res.json(listAllUsers);
});

// Register API
router.post('/register', async (req, res) => {
  const { name, surname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      surname,
      email,
      password: hashedPassword
    });

    res.status(201).json(newUser);

  } catch (error) {
    console.error("Error occured during registration", error);
    res.status(500).json({ error: 'Internal Server Error' });

  }
});


router.post('/login', async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({where: { email }});
    if (!user) {
      return res.status(401).json({error: 'Invalid email or password'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(401).json({erorr: 'Invalid Password'});
    }

    const token = jwt.sign (
      {id: user.id, email: user.email},
      JWT_SECRET,
      {expiresIn: '1h'}
    );

    res.status(200).json({token});

  } catch(error) {
    console.error('Error occured during login', error);
    res.status(500).json({error: 'Internal Server Error'});

  }
})


module.exports = router;


