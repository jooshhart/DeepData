const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthdate: { type: Date, default: null, required: true },
  gender: { type: String, default: null, required: true },
  ethnicity: { type: String, default: null, required: true },
  country: { type: String, default: null, required: true },
});

module.exports = mongoose.model('User', userSchema);