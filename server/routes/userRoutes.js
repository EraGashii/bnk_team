const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, CreditCard } = require('../models');
const jwt = require('jsonwebtoken');

// Get all users (for testing only, remove in production)
router.get('/', async (req, res) => {
  try {
    const listAllUsers = await User.findAll();
    res.json(listAllUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// === 1) Register User & Generate Credit Card ===
// === 1) Register User & Generate Credit Card ===
router.post('/register', async (req, res) => {
  const { name, surname, email, password, address, postalCode, phoneNumber } = req.body;

  if (!name || !surname || !email || !password || !address || !postalCode || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with default status 'Pending'
    const newUser = await User.create({
      name,
      surname,
      email,
      password: hashedPassword,
      address,
      postalCode,
      phoneNumber,
      status: "Pending", // Set user as pending
    });

    // Generate credit card for user
    const generatedCard = await createCreditCardForUser(newUser.id);

    res.status(201).json({
      message: "Registration successful. Your account is under review.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        status: newUser.status, // Return status
      },
      card: generatedCard,
    });
  } catch (error) {
    console.error('Error occurred during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login API / Validation
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is still pending or declined
    if (user.status === 'Pending') {
      return res.status(403).json({ error: 'Account is pending approval' });
    }
    if (user.status === 'Declined') {
      return res.status(403).json({ error: 'Account has been declined' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 3600000,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

/**
Generates a CREDIT CARD based on the userID (this is used in the /register API)
 */
async function createCreditCardForUser(userId) {
  console.log('Creating credit card for user with ID:', userId);
  const randomCardNumber = generateRandomCardNumber();
  const expirationDate = generateRandomExpirationDate();
  const cvv = generateRandomCVV();

  const newCard = await CreditCard.create({
    cardNumber: randomCardNumber,
    expirationDate,
    cvv,
    userId,          // Attach to the newly created user
    status: 'pending' // default or override
  });
  console.log('Credit Card Created:', newCard); 
  return newCard;
}


// Will make changes to these later also, only for testing right now

function generateRandomCardNumber() {
  //  a 16-digit random number
  return '4' + Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0');
}

function generateRandomExpirationDate() {
  
  return '12/28';
}

function generateRandomCVV() {
  return Math.floor(Math.random() * 900 + 100).toString();
}
