const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret_key';

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({error: 'Access denied. No token provided.'});
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(403).json({error: 'Invalid or expired token'});
  }
}

module.exports = authenticateToken;
