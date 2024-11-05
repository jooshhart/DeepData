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

// Update User
const updateUser = async (req, res) => {
  const { birthdate, gender, ethnicity, country } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(birthdate && { birthdate }), // Updating birthdate will trigger age calculation
        ...(gender && { gender }),
        ...(ethnicity && { ethnicity }),
        ...(country && { country })
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update user failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
      user: { id: user._id, username: user.username, email: user.email },
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

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  authenticateToken,
  getUser
};