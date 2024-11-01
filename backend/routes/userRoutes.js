const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController.js');

userRouter.post('/login', userController.loginUser);
userRouter.get('/user', userController.authenticateToken, userController.getUser);

module.exports = userRouter;

