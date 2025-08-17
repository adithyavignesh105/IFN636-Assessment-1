const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createLeave, getLeaves, approveLeave, rejectLeave } = require('../controllers/leaveController');

const router = express.Router();

router.use(protect);
router.post('/', createLeave);
router.get('/', getLeaves);
router.put('/:id/approve', approveLeave);
router.put('/:id/reject', rejectLeave);

module.exports = router;
