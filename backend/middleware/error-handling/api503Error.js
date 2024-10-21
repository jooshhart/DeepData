const httpStatusCodes = require('./httpStatusCodes');
const BaseError = require('./baseError');

class Api503Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.SERVICE_UNAVAILABLE,
    description = 'Service Unavailable',
    isOperational = true,
  ) {
    super(name, statusCode, isOperational, description);
  }
}

module.exports = Api503Error;
