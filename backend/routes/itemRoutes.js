const express = require('express');
const router = express.Router();
const { addItem, getApprovedItems, getMyItems, updateItem, getPendingItems, approveItem, rejectItem } = require('../controllers/itemController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const Item = require('../models/Item.js');


router.route('/')
  .post(protect, upload.single('image'), addItem)
  .get(protect, getApprovedItems);

router.get('/my', protect, getMyItems);

//router.put('/:id', protect, upload.single('image'), updateItem);

router.put('/:id', protect, updateItem);

router.get('/pending', protect, admin, getPendingItems);

router.put('/:id/approve', protect, admin, approveItem);

router.put('/:id/reject', protect, admin, rejectItem);

router.get('/types', (req, res) => {
  const typeEnum = Item.schema.path('type').enumValues;
  res.json(typeEnum);
});


module.exports = router;