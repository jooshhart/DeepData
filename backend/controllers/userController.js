const mongoose = require('mongoose');
const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectId = mongoose.Types.ObjectId;

const JWT_SECRET = process.env.JWT_SECRET || "8d16994523acce0346169ee912397bb058bd254412028ecfb3e063c65419aeb6";

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Step 1: Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Step 3: Generate token and respond with user data
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email }, // Return necessary fields
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header
  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user; // Attach user info from token payload
    next();
  });
};

// Define the route to get user information
const getUser = async (req, res) => {
  try {
    // Fetch user by ID from token payload
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from the result
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  loginUser,
  authenticateToken,
  getUser
};
