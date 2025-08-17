const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // 'HH:mm'
  endTime: { type: String, required: true },   // 'HH:mm'
  role: { type: String },
  location: { type: String },
  status: { type: String, enum: ['assigned', 'swapped', 'completed', 'cancelled'], default: 'assigned' },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Shift', shiftSchema);
