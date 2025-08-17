const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
  shift: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true },
  fromEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Swap', swapSchema);
