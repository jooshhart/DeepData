const express = require('express');
const queryRouter = express.Router();
const queryController = require('../controllers/queryController.js');

// Create query
queryRouter.post('/create', queryController.createQuery);

// Choose answer
queryRouter.patch('/answer', queryController.addParticipantAnswer);

// Get query deatails
queryRouter.get('/detail', queryController.getQueryDetails);

module.exports = queryRouter;