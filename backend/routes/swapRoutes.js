const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createSwap, listSwaps, approveSwap, rejectSwap } = require('../controllers/swapController');

const router = express.Router();
router.use(protect);

router.post('/', createSwap);
router.get('/', listSwaps);
router.put('/:id/approve', approveSwap);
router.put('/:id/reject', rejectSwap);

module.exports = router;
