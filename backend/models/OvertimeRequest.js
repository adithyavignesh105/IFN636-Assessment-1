const mongoose = require('mongoose');

const overtimeRequestSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  hours: { type: Number, min: 0.25, required: true },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  appliedRule: { type: mongoose.Schema.Types.ObjectId, ref: 'OvertimeRule' },
  multiplier: { type: Number, default: 1.0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('OvertimeRequest', overtimeRequestSchema);
