const httpStatusCodes = require('./httpStatusCodes');
const BaseError = require('./baseError');

class Api413Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.PAYLOAD_TOO_LARGE,
    description = 'Payload Too Large',
    isOperational = true,
  ) {
    super(name, statusCode, isOperational, description);
  }
}

module.exports = Api413Error;
