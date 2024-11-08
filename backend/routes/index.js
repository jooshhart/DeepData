const express = require('express');
const homeRouter = express.Router();

homeRouter.use('/users', require('./userRoutes.js'));
homeRouter.use('/query', require('./queryRoutes.js'));

module.exports = homeRouter;