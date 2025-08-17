const Swap = require('../models/Swap');
const Shift = require('../models/Shift');
const User = require('../models/User');

const createSwap = async (req, res) => {
  try {
    const { shiftId, toEmployeeEmail, reason } = req.body;
    const shift = await Shift.findById(shiftId);
    if (!shift) return res.status(404).json({ message: 'Shift not found' });
    if (String(shift.employee) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only swap your own shift' });
    }
    const toEmp = await User.findOne({ email: toEmployeeEmail });
    if (!toEmp) return res.status(404).json({ message: 'Target user not found' });

    const swap = await Swap.create({
      shift: shiftId,
      fromEmployee: req.user._id,
      toEmployee: toEmp._id,
      reason,
      requestedBy: req.user._id,
    });
    res.status(201).json(swap);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const listSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ fromEmployee: req.user._id }, { toEmployee: req.user._id }]
    }).sort({ createdAt: -1 }).populate('shift').populate('fromEmployee toEmployee', 'name email');
    res.json(swaps);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const approveSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id).populate('shift');
    if (!swap) return res.status(404).json({ message: 'Swap not found' });
    if (String(swap.toEmployee) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the target employee can approve' });
    }
    swap.status = 'approved';
    swap.approvedBy = req.user._id;
    await swap.save();
    // Update shift ownership
    const shift = await Shift.findById(swap.shift._id);
    shift.employee = swap.toEmployee;
    shift.status = 'swapped';
    await shift.save();
    res.json(swap);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const rejectSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });
    if (String(swap.toEmployee) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the target employee can reject' });
    }
    swap.status = 'rejected';
    swap.approvedBy = req.user._id;
    await swap.save();
    res.json(swap);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

module.exports = { createSwap, listSwaps, approveSwap, rejectSwap };
