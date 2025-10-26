const express = require('express');
// const { register, login } = require('../controllers/authController');

const router = express.Router();

// Routes موقت برای احراز هویت
router.post('/register', (req, res) => {
  res.json({ 
    success: true,
    message: 'Register route is working - User model needed' 
  });
});

router.post('/login', (req, res) => {
  res.json({ 
    success: true,
    message: 'Login route is working - Auth controller needed',
    token: 'temp-token'
  });
});

// بعداً وقتی authController آماده شد:
// router.post('/register', register);
// router.post('/login', login);

module.exports = router;