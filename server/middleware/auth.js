const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token =
    req.cookies?.token || req.headers['authorization']?.split(' ')[1]; // Check cookies or Authorization header
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
    req.user = decoded; // Attach user data to request
    next(); // Proceed to the next middleware
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;
