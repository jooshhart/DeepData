const { default: mongoose } = require('mongoose');
const User = require('../models/userModel.js');
const ObjectId = mongoose.Types.ObjectId

const getAll = async (req, res) => {
  const user = await User.find();
  res.setHeader('Content-Type', 'application/json');
  res.json(user);
}

const getUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid User ID' });
  }
  const user = await User.findById(req.params.id);
  res.setHeader('Content-Type', 'application/json');
  res.json(user);
}

const createUser = async (req, res) => {
  const user = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
  }

  const newUser = new User(user);
  await newUser.save();
  res.json(newUser);
}

const updateUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid User ID' });
  }
  const user = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, user, {new: true});
  res.json(updatedUser)
}

const deleteUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid User ID' });
  }
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  res.json(deletedUser)
}

module.exports = {
  getAll,
  getUser,
  createUser,
  updateUser,
  deleteUser
}