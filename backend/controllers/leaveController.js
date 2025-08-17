const Leave = require('../models/Leave');

const createLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    const leave = await Leave.create({
      employee: req.user._id,
      type, startDate, endDate, reason,
      createdBy: req.user._id,
    });
    res.status(201).json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getLeaves = async (req, res) => {
  try {
    const list = await Leave.find({ employee: req.user._id }).sort({ startDate: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    leave.status = 'approved';
    leave.approver = req.user._id;
    await leave.save();
    res.json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    leave.status = 'rejected';
    leave.approver = req.user._id;
    await leave.save();
    res.json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createLeave, getLeaves, approveLeave, rejectLeave };
