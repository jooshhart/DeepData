const Query = require('../models/queryModel');

// 1. Function to create a new query
const createQuery = async (req, res) => {
  try {
    const { userId, userName, queryName, answers } = req.body;

    console.log("Received data from frontend:", req.body);

    const query = new Query({
      createdBy: { userId, userName },
      queryName,
      answers: answers.map(answer => ({ answer, count: 0 })), // Initialize answers with count 0
    });

    console.log("Query object before saving:", query);

    await query.save();
    res.status(201).json(query);
  } catch (error) {
    console.error("Error saving query:", error);
    res.status(500).json({ message: error.message });
  }
};

// 2. Function to add participant's selected answer to the query
const addParticipantAnswer = async (req, res) => {
  try {
    const { queryId, userId, answer } = req.body;

    // Check if user has already answered
    const query = await Query.findById(queryId);
    const participantExists = query.participants.some(p => p.userId.toString() === userId);

    if (participantExists) {
      return res.status(400).json({ message: 'User has already participated in this query.' });
    }

    // Add participant with selected answer
    query.participants.push({ userId, answer });

    // Increment the answer count
    const answerIndex = query.answers.findIndex(a => a.answer === answer);
    if (answerIndex > -1) {
      query.answers[answerIndex].count += 1;
    } else {
      return res.status(400).json({ message: 'Answer not found in query.' });
    }

    await query.save();
    res.status(200).json(query);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Function to display a query and its information
const getQueryDetails = async (req, res) => {
  try {
    const { queryId } = req.params;

    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    res.status(200).json(query);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createQuery, addParticipantAnswer, getQueryDetails };