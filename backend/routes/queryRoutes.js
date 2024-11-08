const express = require('express');
const queryRouter = express.Router();
const queryController = require('../controllers/queryController.js');

// Create query
queryRouter.post('/create', queryController.createQuery);

// Login route
queryRouter.patch('/answer', queryController.addParticipantAnswer);

// Get user info route (protected)
queryRouter.get('/user', queryController.getQueryDetails);

module.exports = queryRouter;