const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createShift, getShifts, updateShift, deleteShift } = require('backend/controllers/ShiftController.js');

const router = express.Router();

router.use(protect);
router.post('/', createShift);
router.get('/', getShifts);
router.put('/:id', updateShift);
router.delete('/:id', deleteShift);

module.exports = router;
