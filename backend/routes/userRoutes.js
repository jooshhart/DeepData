const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController.js');

// Register route
userRouter.post('/register', userController.registerUser);

// Login route
userRouter.post('/login', userController.loginUser);

// Get user info route (protected)
userRouter.get('/user', userController.authenticateToken, userController.getUser);

// Update user info route (protected)
userRouter.put('/user', userController.authenticateToken, userController.updateUser);

module.exports = userRouter;
