const jwt = require('jsonwebtoken');
const { Api400Error, Api401Error, Api500Error } = require('../error-handling/apiErrors');
const AccountModel = require('../../models/accountModel');
const getAuthToken = (req, res, next) => {
  if (!req.get('Authorization')) {
    throw new Api401Error('Not authorized');
  }

  let token;
  try {
    token = req.get('Authorization').split(' ')[1];
  } catch (err) {
    throw new Api400Error(err.message);
  }
  let decodedToken;
  try {
    // Attempt to verify the JSON webtoken using our JWT_SECRET_KEY
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    throw new Api401Error(err.message);
  }

  if (!decodedToken || decodedToken == null) {
    throw new Api401Error('Not authenticated');
  }

  AccountModel.findOne({ _id: decodedToken.id }).then((account) => {

    if (!account || decodedToken.jwt_ver != account.accessjwtVersion) {
      next(new Api401Error('Invalid Access Token'));
    } else {
      req.accountId = decodedToken.id;

      next();
    }
  });
};

const getBusinessAuthToken = (req, res, next) => {
  if (!req.get('Authorization')) {
    throw new Api401Error('Not authenticated');
  }
  let token;
  try {
    token = req.get('Authorization').split(' ')[1];
  } catch (err) {
    throw new Api400Error(err.message);
  }
  let decodedToken;

  try {
    // Attempt to verify the JSON webtoken using our JWT_SECRET_KEY
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    throw new Api401Error(err.message);
  }
  if (!decodedToken || decodedToken == null) {
    throw new Api401Error('Not authenticated');
  }
  BusinessModel.findOne({ _id: decodedToken.id }).then((account) => {
    if (!account || decodedToken.jwt_ver != account.accessjwtVersion) {
      next(new Api401Error('Invalid Access Token'));
    } else {
      req.businessId = decodedToken.id;
      next();
    }
  });
}

const getAdminAuthToken = (req, res, next) => {
  if (!req.get('Authorization')) {
    throw new Api401Error('Not authenticated');
  }
  let token;
  try {
    token = req.get('Authorization').split(' ')[1];
  } catch (err) {
    throw new Api400Error(err.message);
  }
  let decodedToken;

  try {
    // Attempt to verify the JSON webtoken using our JWT_SECRET_KEY
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    throw new Api401Error(err.message);
  }
  if (!decodedToken || decodedToken == null) {
    throw new Api401Error('Not authenticated');
  }
  AccountModel.findOne({ _id: decodedToken.id }).then((account) => {
    if (!account || decodedToken.jwt_ver != account.accessjwtVersion) {
      next(new Api401Error('Invalid Access Token'));
    } else {
      if(account.authLevel == 'admin' && account.role == 'admin' && account.currStatus == 'Active') {
        req.adminId = decodedToken.id;
        next();
      } else {
        next(new Api401Error('Invalid Access Code'))
      }
    }
  });
}
module.exports = {
  getAuthToken,
  getBusinessAuthToken,
  getAdminAuthToken
}