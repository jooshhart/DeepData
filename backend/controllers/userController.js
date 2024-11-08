const mongoose = require('mongoose');
const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectId = mongoose.Types.ObjectId;

const JWT_SECRET = process.env.JWT_SECRET || "8d16994523acce0346169ee912397bb058bd254412028ecfb3e063c65419aeb6";

// Register User
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ userId: savedUser._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: savedUser._id, username: savedUser.username, email: savedUser.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Patch a user's details by ID
const patchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Only include fields that are in the schema
    const allowedUpdates = ['username', 'email', 'password', 'birthdate', 'gender', 'ethnicity', 'country'];
    const filteredUpdates = {};

    for (const key of Object.keys(updates)) {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    }

    const user = await User.findByIdAndUpdate(id, filteredUpdates, {
      new: true, // return the updated document
      runValidators: true, // validate data before updating
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email, birthdate: user.birthdate, gender: user.gender, ethnicity: user.ethnicity, country: user.country },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

// Get User
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    // Find all users, projecting only the specified fields
    const users = await User.find({}, 'birthdate gender ethnicity country');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  patchUser,
  authenticateToken,
  getUser,
  getAllUsers
};