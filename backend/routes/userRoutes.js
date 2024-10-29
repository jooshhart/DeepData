const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController.js');

userRouter.get('/profile', userController.authenticateJWT, userController.getUser);
userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
userRouter.put('/profile', userController.authenticateJWT, userController.updateUserProfile);

module.exports = userRouter;

