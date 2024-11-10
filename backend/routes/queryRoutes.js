const express = require('express');
const queryRouter = express.Router();
const queryController = require('../controllers/queryController.js');

// Create query
queryRouter.post('/create', queryController.createQuery);

// Choose answer
queryRouter.patch('/answer', queryController.addParticipantAnswer);

// Get query deatails
queryRouter.get('/unparticipated/:userId', queryController.getUnparticipatedQueries);

queryRouter.get('/participated/:userId', queryController.getParticipatedQueries);

queryRouter.get('/:id', queryController.getQueryById)

module.exports = queryRouter;