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