const mongoose = require('mongoose');

const overtimeRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0=Sunday
  startHour: { type: Number, min: 0, max: 24, default: 0 },
  endHour: { type: Number, min: 0, max: 24, default: 24 },
  multiplier: { type: Number, min: 1, default: 1.5 },
  minHours: { type: Number, min: 0, default: 0 },
  requiresApproval: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('OvertimeRule', overtimeRuleSchema);
