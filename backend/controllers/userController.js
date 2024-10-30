const mongoose = require('mongoose');
const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectId = mongoose.Types.ObjectId;

// Fetch a user by ID
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Registration error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updateData = { username, email, ...(hashedPassword && { password: hashedPassword }) };

    const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Profile update error' });
  }
};

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Unauthorized access' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Unauthorized access' });
    req.userId = decoded.userId;
    next();
  });
};

module.exports = {
  getUser,
  registerUser,
  updateUserProfile,
  authenticateJWT,
};
