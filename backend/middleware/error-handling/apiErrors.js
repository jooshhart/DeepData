// Just here to be an easy way to import all of the api errors at once.
const Api400Error = require('./api400Error');
const Api401Error = require('./api401Error');
const Api403Error = require('./api403Error');
const Api404Error = require('./api404Error');
const Api405Error = require('./api405Error');
const Api413Error = require('./api413Error');
const Api415Error = require('./api415Error');
const Api429Error = require('./api429Error');
const Api500Error = require('./api500Error');
const Api503Error = require('./api503Error');

module.exports = {
  Api400Error,
  Api401Error,
  Api403Error,
  Api404Error,
  Api405Error,
  Api413Error,
  Api415Error,
  Api429Error,
  Api500Error,
  Api503Error,
};
