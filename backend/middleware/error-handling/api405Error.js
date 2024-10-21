const httpStatusCodes = require('./httpStatusCodes');
const BaseError = require('./baseError');

class Api405Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.METHOD_NOT_ALLOWED,
    description = 'Method Not Allowed',
    isOperational = true,
  ) {
    super(name, statusCode, isOperational, description);
  }
}

module.exports = Api405Error;