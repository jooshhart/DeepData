// routes/authRoutes.js
const express = require('express');
const User = require('../models/User'); // Adjust the path based on your project structure
const bcrypt = require('bcrypt');
const router = express.Router();

// routes/authRoutes.js
router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
  
    try {
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists.' });
      }
  
      // Check if the email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists.' });
      }
  
      // Ensure password is at least 6 characters long
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      }
  
      // Create a new user
      const newUser = new User({
        username,
        password,
        email,
      });
  
      await newUser.save();
      res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
      console.error('Error during sign-up:', error);
      // Handle Mongoose validation errors and send specific error messages
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: errors.join(', ') });
      }
      res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
  });  