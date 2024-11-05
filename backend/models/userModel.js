const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  birthdate: { type: Date, default: null },
  age: { type: Number, default: null }, // Store age directly in the model
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'N/A'], default: 'N/A' },
  ethnicity: { type: String, default: 'N/A' },
  country: { type: String, default: 'N/A' }
});

// Pre-save hook to calculate age based on birthdate
userSchema.pre('save', function (next) {
  if (this.birthdate) {
    const today = new Date();
    const birthDate = new Date(this.birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    this.age = age; // Set age directly in the document
  }
  next();
});

// Ensure age is updated when birthdate is modified
userSchema.pre('findOneAndUpdate', function (next) {
  if (this._update.birthdate) {
    const today = new Date();
    const birthDate = new Date(this._update.birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    this._update.age = age; // Update age in the database
  }
  next();
});

module.exports = mongoose.model('User', userSchema);