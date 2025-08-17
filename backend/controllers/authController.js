const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const registerUser = async (req, res) => {
  const { name, email, password, university, address } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, university, address });
    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      university: user.university,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      university: user.university,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  const user = req.user;
  return res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    university: user.university,
    address: user.address,
  });
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email, university, address, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (university) user.university = university;
    if (address) user.address = address;
    if (password) user.password = password;

    const updated = await user.save();
    return res.json({
      id: updated._id,
      name: updated.name,
      email: updated.email,
      university: updated.university,
      address: updated.address,
      token: generateToken(updated._id),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateUserProfile };
