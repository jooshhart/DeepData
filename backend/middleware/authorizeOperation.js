const AccountModel = require('../models/accountModel');
const { Api401Error, Api400Error } = require('./error-handling/apiErrors');

const authorizeOperation = async (requestParty, target) => {
  //reqparamsID is Target, reqAccountId is authorizing party, level is access rights
  try {
    if (requestParty && target) {
      if (requestParty.id == target.id) {
        return true;
      } else {
        if (requestParty.authLevel == 'admin' && requestParty.role == 'admin') {
          return true;
        } else {
          return false;
        }
      }
    } else {
      throw new Api401Error('Missing Authorization Attempt');
    }
  } catch (err) {
    throw new Api401Error(`${err.message}`);
  }
};

const authAdminAccess = async (requestParty) => {
  try{
    const acct = await AccountModel.findById({_id: requestParty})
    if(acct.role == 'admin' && acct.authLevel == 'admin'){
      return true
    } else {
      return false
    }
  } catch(err){
    throw new Api401Error(`${err.message}`)
  }
}

module.exports = {
  authorizeOperation,
  authAdminAccess,
};
