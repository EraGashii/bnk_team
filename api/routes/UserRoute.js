const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');


router.get('/', async (req, res) => {
  const listAllUsers = await User.findAll();
  res.json(listAllUsers);
});

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


module.exports = router;


