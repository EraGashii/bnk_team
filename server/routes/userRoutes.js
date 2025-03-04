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

// Verify JWT token and authenticate user
router.get('/verify', async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

    // Fetch the user from the database
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }, // Exclude sensitive data
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data
    res.json({ user });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// === Edit User 
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, surname, email, address, postalCode, phoneNumber, status } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user details
    user.name = name || user.name;
    user.surname = surname || user.surname;
    user.email = email || user.email;
    user.address = address || user.address;
    user.postalCode = postalCode || user.postalCode;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.status = status || user.status;

    await user.save();

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// == Delete User 
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Approve User
router.put('/:id/approve', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status !== 'Pending') {
      return res.status(400).json({ error: 'User is not pending approval' });
    }

    user.status = 'Active';
    await user.save();

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Deny User
router.put('/:id/deny', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status !== 'Pending') {
      return res.status(400).json({ error: 'User is not pending approval' });
    }

    user.status = 'Declined';
    await user.save();

    res.json({ message: 'User denied successfully', user });
  } catch (error) {
    console.error('Error denying user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Pending Users
router.get('/pending', async (req, res) => {
  try {
    const pendingUsers = await User.findAll({ where: { status: 'Pending' } });
    res.json(pendingUsers);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Active Users
router.get('/active', async (req, res) => {
  try {
    const activeUsers = await User.findAll({ where: { status: 'Active' } });
    res.json(activeUsers);
  } catch (error) {
    console.error('Error fetching active users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Declined Users
router.get('/declined', async (req, res) => {
  try {
    const declinedUsers = await User.findAll({ where: { status: 'Declined' } });
    res.json(declinedUsers);
  } catch (error) {
    console.error('Error fetching declined users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
      { id: user.id, email: user.email, role: user.role },
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
