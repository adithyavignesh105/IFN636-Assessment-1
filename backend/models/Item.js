
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['Lost', 'Found'], required: true },
    image: { type: String, required: false },
    campus: {type:String, enum: ['Gardens Point', 'Kelvin Grove'] , default: 'Gardens Point'},
    location: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    deadline: { type: Date }
});

module.exports = mongoose.model('Item', itemSchema);
