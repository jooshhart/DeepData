const express = require('express');
const userRouter = express.Router();

const userController = require('../controllers/userController.js')

userRouter.get('/', userController.getAll);
userRouter.get('/:id', userController.getUser);
userRouter.post('/', userController.createUser);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);

module.exports = userRouter;