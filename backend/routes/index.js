const express = require('express');
const homeRouter = express.Router();

homeRouter.use('/users', require('./userRoutes.js'));

module.exports = homeRouter;