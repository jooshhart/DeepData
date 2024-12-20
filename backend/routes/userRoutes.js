const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController.js');

// Register route
userRouter.post('/register', userController.registerUser);

// Login route
userRouter.post('/login', userController.loginUser);

// Get user info route (protected)
userRouter.get('/user', userController.authenticateToken, userController.getUser);

// Update user info route
userRouter.patch('/update/:id', userController.patchUser);

// Get All Users
userRouter.get('/all', userController.getAllUsers);

userRouter.get('/confirm/:token', userController.confirmEmail);

module.exports = userRouter;
