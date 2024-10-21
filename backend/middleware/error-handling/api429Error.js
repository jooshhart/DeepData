const httpStatusCodes = require('./httpStatusCodes');
const BaseError = require('./baseError');

class Api429Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.TOO_MANY_REQUESTS,
    description = 'Too Many Requests',
    isOperational = true,
  ) {
    super(name, statusCode, isOperational, description);
  }
}

module.exports = Api429Error;
