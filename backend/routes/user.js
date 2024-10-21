const routes = require('express').Router();
const accounts = require('../controllers/accountController');
const isAuth = require('../middleware/isAuthenticated');
const validator = require('../middleware/accountValidation');

routes.get('/:id', isAuth.getAuthToken, accounts.getAccountById);

routes.post('/add', validator.accountValidation, accounts.addAccount);

routes.patch('/edit/:id', validator.accountValidation, isAuth.getAuthToken, accounts.editAccount);

routes.patch('/delete/:id', isAuth.getAuthToken, accounts.deleteAccount);

routes.patch('/change-status/:status/:id', isAuth.getAuthToken, accounts.setAccountStatus);

routes.patch('/edit-password/:id', isAuth.getAuthToken, accounts.editPassword);

routes.post('/passwordReset', accounts.firstStepPasswordReset)

routes.post('/passwordReset/:id/:token', accounts.secondStepPasswordReset)

routes.use('/login', require('./login'));

module.exports = routes;
