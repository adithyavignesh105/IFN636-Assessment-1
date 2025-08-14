const express = require('express');
const router = express.Router();
const { addItem, getApprovedItems, getMyItems,  updateItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .post(protect, addItem)
  .get(protect, getApprovedItems);

router.get('/my', protect, getMyItems);

router.put('/:id', protect, upload.single('image'), updateItem);