const express = require('express');
const router = express.Router();
const { addItem, getApprovedItems, getMyItems } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addItem)
  .get(protect, getApprovedItems);

router.get('/my', protect, getMyItems);

