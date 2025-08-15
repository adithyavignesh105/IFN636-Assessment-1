
const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const User = require('../models/User.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/roles', (req, res) => {
  const roleEnum = User.schema.path('role').enumValues;
  res.json(roleEnum);
});

module.exports = router;
