const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  // ID and name of the user who created the query
  createdBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
  },
  // Name of the query
  queryName: { type: String, required: true },
  // Answers to the query, stored as an array of objects where each answer has a string (answer) and a count
  answers: [
    {
      answer: { type: String, required: true },
      count: { type: Number, default: 0 },
    },
  ],
  // Array of participants who added data to the query
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      age: { type: Number },
      gender: { type: String },
      ethnicity: { type: String },
      country: { type: String },
      answer: { type: String }, // Stores the participant's selected answer
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
