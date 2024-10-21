const routes = require('express').Router();
const account = require('../controllers/accountController.js');
//const isAuth = require("../middleware/auth/isAuthenticated");

routes.post(
  '/',
  // Maybe we will need to prevent the user to do not generate another if he is already in
  user.login,
  /* #swagger.summary = 'Login endpoint.' */
  /* #swagger.description = 'Generate token' */
  /* #swagger.operationId = 'login' */
  /* #swagger.parameters = [{
    name: 'body', 
    in:'body',
    schema: { $ref: '#/definitions/Credentials' }
  }] */
  /* #swagger.responses[200] = {
    description: 'Insert token as cookie. Returns Authorization Token',
    schema: { $ref: '#/definitions/Token'}
  }
  */
);

routes.get(
  '/refresh',
  // Maybe we will need to prevent the user to do not generate another if he is already in
  user.refresh,
  /* #swagger.summary = 'Refresh endpoint.' */
  /* #swagger.description = 'Generate new access token using refresh token' */
  /* #swagger.operationId = 'refresh' */
  /* #swagger.responses[200] = {
    description: 'Insert token as cookie. Returns Authorization Token',
    schema: { $ref: '#/definitions/Token'}
  }
  */
);