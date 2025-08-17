const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createRule, listRules, updateRule, deleteRule,
  createOvertime, listOvertime, approveOvertime, rejectOvertime
} = require('../controllers/overtimeController');

const router = express.Router();
router.use(protect);

// Rules
router.post('/rules', createRule);
router.get('/rules', listRules);
router.put('/rules/:id', updateRule);
router.delete('/rules/:id', deleteRule);

// Requests
router.post('/requests', createOvertime);
router.get('/requests', listOvertime);
router.put('/requests/:id/approve', approveOvertime);
router.put('/requests/:id/reject', rejectOvertime);

module.exports = router;
