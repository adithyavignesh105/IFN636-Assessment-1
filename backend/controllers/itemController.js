const Item = require('../models/Item');

// Add item
const addItem = async (req, res) => {
    try {
        const { title, description, type, deadline } = req.body;

        const item = await Item.create({
            userId: req.user.id,
            title,
            description,
            type,
            deadline
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get approved items（for user listing）
const getApprovedItems = async (req, res) => {
    try {
        const items = await Item.find({ status: 'approved' });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get own items（for user managing item）
const getMyItems = async (req, res) => {
    try {
        const items = await Item.find({ userId: req.user.id });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};