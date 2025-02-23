const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.get('/verify', (req, res) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ authenticated: false, error: 'No token found' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret')
    return res.json({ authenticated: true, user: decoded })
  } catch (error) {
    return res.status(401).json({ authenticated: false, error: 'Invalid token' })
  }
})

module.exports = router
