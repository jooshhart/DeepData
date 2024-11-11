const Query = require('../models/queryModel');

// 1. Function to create a new query
const createQuery = async (req, res) => {
  try {
    // Extract data from the request body
    const { createdBy, queryName, answers } = req.body;

    // Validate required fields
    if (!createdBy || !createdBy.userId || !createdBy.userName || !queryName || !answers) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate that answers is an array of strings
    if (!Array.isArray(answers) || answers.some(answer => typeof answer !== 'string')) {
      return res.status(400).json({ message: "Answers should be an array of strings." });
    }

    // Create the new query
    const newQuery = new Query({
      createdBy: {
        userId: createdBy.userId,
        userName: createdBy.userName,
      },
      queryName: queryName,
      answers: answers.map(answer => ({ answer })), // Format answers into the correct structure
    });

    // Save the query to the database
    const savedQuery = await newQuery.save();

    // Respond with the newly created query
    res.status(201).json(savedQuery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Could not create query." });
  }
};

// 2. Function to add participant's selected answer to the query
const addParticipantAnswer = async (req, res) => {
  try {
    const { queryId, userId, answer, age, gender, ethnicity, country } = req.body;

    // Check if user has already answered
    const query = await Query.findById(queryId);
    const participantExists = query.participants.some(p => p.userId.toString() === userId);

    if (participantExists) {
      return res.status(400).json({ message: 'User has already participated in this query.' });
    }

    // Add participant with full information and selected answer
    query.participants.push({ userId, answer, age, gender, ethnicity, country });

    // Increment the answer count if it exists
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
const getQueryById = async (req, res) => {
  try {
    // Extract query ID from request parameters
    const { id } = req.params;

    // Find the query by ID and select the necessary fields
    const query = await Query.findById(id).select('createdBy.userName queryName answers participants');

    // Check if the query exists
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    // Send response with selected fields including participants
    res.status(200).json({
      createdBy: query.createdBy.userName,
      queryName: query.queryName,
      answers: query.answers.map(answer => answer.answer), // Extract answers
      participants: query.participants.map(participant => ({
        userId: participant.userId,
        age: participant.age,
        gender: participant.gender,
        ethnicity: participant.ethnicity,
        country: participant.country,
        answer: participant.answer,
      })), // Extract participant details
    });
  } catch (error) {
    console.error('Error fetching query:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Functions to display all queries based on participation
// Get queries user has NOT participated in, only returning the creator's username and the query name
const getUnparticipatedQueries = async (req, res) => {
  try {
    const { userId } = req.params;
    const queries = await Query.find(
      { "participants.userId": { $nin: [userId] } }, // Exclude queries where user has participated
      'queryName createdBy.userName' // Only include queryName and createdBy.userName fields
    );
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving unparticipated queries' });
  }
};

// Get queries user has participated in, only returning the creator's username and the query name
const getParticipatedQueries = async (req, res) => {
  try {
    const { userId } = req.params;
    const queries = await Query.find(
      { "participants.userId": { $in: [userId] } }, // Only include queries where user has participated
      'queryName createdBy.userName' // Only include queryName and createdBy.userName fields
    );
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving participated queries' });
  }
};

const getCreatedQueries = async (req, res) => {
  try {
    const { userId } = req.params;
    const queries = await Query.find(
      { "createdBy.userId": {$in: [userId] } }, //only include queries where user has created
      'queryName' // Only include queryName
    );
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving created queries' });
  }
};

module.exports = { createQuery, addParticipantAnswer, getUnparticipatedQueries, getParticipatedQueries, getQueryById, getCreatedQueries };