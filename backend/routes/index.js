const express = require('express');
const homeRouter = express.Router();

homeRouter.use('/user', require('./userRoutes.js'));

module.exports = homeRouter;