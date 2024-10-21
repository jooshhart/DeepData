const { body } = require('express-validator');
const AccountModel = require('../../models/user');
const { Api400Error } = require('../error-handling/apiErrors');

exports.accountValidation = [
  body('firstName')
    .optional()
    .custom((name) => {
      if (name.trim() === '') {
        throw new Api400Error('Empty value');
      }
      return true;
    })
    .withMessage({
      status: 400,
      message: 'Empty value',
    }),

  body('lastName')
    .optional()
    .custom((name) => {
      if (name.trim() === '') {
        throw new Api400Error('Empty value');
      }
      return true;
    })
    .withMessage({
      status: 400,
      message: 'Empty value',
    }),

  body('email')
    .optional()
    .isEmail()
    .withMessage({
      status: 400,
      message: 'Invalid email address',
    })

    .normalizeEmail({ gmail_remove_dots: false })

    .custom(async (value) => {
      return AccountModel.find({ email: value }).then((users) => {
        if (users.length > 0) {
          throw new Api400Error('Email is already in use.');
        }
      });
    })
    .withMessage({
      status: 400,
      message: 'Email is already in use.',
    }),

  body('password')
    .optional()
    .custom((password) => {
      match = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\w\W]{8,}$/.test(password); // Minimum eight characters, at least one letter and one number:

      if (!match) {
        throw new Api400Error('Invalid password');
      }
      return true;
    })
    .withMessage({
      status: 400,
      message: 'Please enter a password of at least 8 characters with 1 letter and 1 number',
    }),
];