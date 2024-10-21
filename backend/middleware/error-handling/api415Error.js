const httpStatusCodes = require('./httpStatusCodes');
const BaseError = require('./baseError');

class Api415Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.UNSUPPORTED_TYPE,
    description = 'Unsupported Type',
    isOperational = true,
  ) {
    super(name, statusCode, isOperational, description);
  }
}

module.exports = Api415Error;
