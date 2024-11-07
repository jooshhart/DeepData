const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthdate: { type: Date, default: null },
  gender: { type: String, default: null },
  ethnicity: { type: String, default: null },
  country: { type: String, default: null },
});

module.exports = mongoose.model('User', userSchema);