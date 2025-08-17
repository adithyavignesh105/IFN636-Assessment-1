const Shift = require('../models/Shift');

const createShift = async (req, res) => {
  try {
    const { date, startTime, endTime, role, location, employeeId, notes } = req.body;
    const shift = await Shift.create({
      employee: employeeId || req.user._id,
      date, startTime, endTime, role, location, notes,
      createdBy: req.user._id,
    });
    res.status(201).json(shift);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getShifts = async (req, res) => {
  try {
    const mine = await Shift.find({ $or: [{ employee: req.user._id }, { createdBy: req.user._id }] })
      .sort({ date: 1, startTime: 1 }).populate('employee', 'name email');
    res.json(mine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateShift = async (req, res) => {
  try {
    const s = await Shift.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Shift not found' });
    if (String(s.createdBy) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed' });
    Object.assign(s, req.body);
    await s.save();
    res.json(s);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteShift = async (req, res) => {
  try {
    const s = await Shift.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Shift not found' });
    if (String(s.createdBy) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed' });
    await s.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createShift, getShifts, updateShift, deleteShift };
