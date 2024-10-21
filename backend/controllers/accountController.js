const AccountModel = require('../models/user');
const { validationResult } = require('express-validator');
const { encryptPassword } = require('../middleware/passwordEncryption');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authorizeOperation} = require('../middleware/authorizeOperation');

const BACK_DOMAIN = require('../domain/backendURL');
const emailAPI = require('./emailController');
const axios = require('axios');
require('dotenv').config();
/*****************************
 * Function: getAccountById
 *
 *
 * Description: Find AccountModel object and return certain values. We do not return the object itself, but some values found in the object
 *
 *
 * Inputs: params.id <- Account
 *
 *
 * Outputs: multiple fields
 *
 *
 * Use case: View profile on customer page
 *
 *
 *********************** */

const getAccountById = async (req, res, next) => {
  try {
    const acct = await AccountModel.findOne({ _id: req.params.id, currStatus: 'Active' }).lean();
    if (acct) {
      let user = {
        requiredDocs: acct.requiredDocs,
        created: acct.accountCreated,
        email: acct.email,
        username: acct.username,
      };
      res.status(200).json({ doc: user });
    } else {
      res.status(400).json({ err: 'Account Not Found' });
    }
  } catch (err) {
    next(err);
  }
};

/*****************************
 * Function: addAccount
 *
 *
 * Description: Creates an Account Model object
 *
 *
 * Inputs: body.email, password, firstname
 *
 *
 * Outputs: AccountModel Object, nothing is returned
 *
 *
 * Use case: Create Account/Sign Up
 *
 *
 *********************** */

const addAccount = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsArray = errors.array();
      if (errorsArray.length == 1) {
        return res.status(400).json({ error: errorsArray[0].msg });
      } else {
        return res.status(400).json({ errors: errorsArray });
      }
    } else {
      const delAcc = await DeletedAccountModel.findOne({ email: req.body.email });
      if (delAcc) {
        res
          .status(400)
          .json({ msg: 'This email has already been used, please use a different email' });
      } else {
        const encryptedPassword = await encryptPassword(req.body.password);
        const accountReq = {
          documents: req.body.requiredDocs,
          created: req.body.accountCreated,
          email: req.body.email,
          password: encryptedPassword,
          username: req.body.username,
        };
        let account = new AccountModel(accountReq);
        account.stripeId = crypt.encryptText((await createCustomer(accountReq)).id); // Stripe Create
        account.save().then(async (savedDoc) => {
          if (savedDoc !== account) {
            AccountModel.findByIdAndDelete({ _id: account.id });
            res.status(400).json({ err: 'Unable to create Account' });
          } else {
            await emailAPI.sendUserWelcomeEmail(account.firstName, account.email);
            res.status(200).json({ msg: 'Account Created' });
          }
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

/*****************************
 * Function: editAccount
 *
 *
 * Description: Edit values about the profile account
 *
 *
 * Inputs: Any value in the model object, see that for details
 *
 *
 * Outputs: Nothing returns, but updating Account object on the DB
 *
 *
 * Use case: Edit Profile/Preferences
 *
 *
 *********************** */

const editAccount = async (req, res, next) => {
  try {
    if (!(await authorizeOperation(req.accountId, req.params.id))) {
      return res.status(401).json({ err: 'Not authorized' });
    } else {
      const errors = validationResult(req);
      const account = await AccountModel.findById(req.params.id);
      const errorsArray = errors.array();
      if (req.body.email === account.email) {
        errorsArray.pop();
      }
      if (errorsArray.length != 0) {
        if (errorsArray.length == 1) {
          res.status(errorsArray[0].msg.status).json({ error: errorsArray[0] });
        } else {
          res.status(400).json({ errors: errorsArray });
        }
      } else {
        try {
          const updates = {
            requiredDocs: req.body.requiredDocs,
            email: req.body.email,
            username: req.body.username,
          };
          await updateCustomer(account.stripeId, updates);
          const updatedAccount = await AccountModel.findByIdAndUpdate(
            { _id: req.params.id },
            updates,
          );
          updatedAccount.save().then((doc) => {
            if (doc === updatedAccount) {
              res.status(200).json({ msg: 'Update Successful' });
            } else {
              res.status(400).json({ err: 'Unable to update Account' });
            }
          });
        } catch (err) {
          next(err);
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

/*****************************
 * Function: deleteAccount
 *
 *
 * Description: Deletes the Account Object
 *
 *
 * Inputs: params.id <- AccountID
 *
 *
 * Outputs: Nothing, but Account Objected removed from DB
 *
 *
 * Use case: Delete/Remove Account on FE
 *
 *
 *********************** */

const deleteAccount = async (req, res, next) => {
  try {
    const acc = await AccountModel.findById({ _id: req.params.id });
    const isDeleted = await deleteCustomer(acc.stripeId);
    if (isDeleted) {
      let delAcc = await addDeletedAccount(
        req.params.id,
        acc.email,
        acc.username,
      );
      if (delAcc) {
        const delAccount = await AccountModel.findByIdAndDelete({ _id: req.params.id });
        if (delAccount) {
          res.status(200).json({ msg: 'Account Deleted' });
        } else {
          res.status(400).json({ msg: 'Unable to delete Account, please contact Subitt Support' });
        }
      } else {
        res.status(400).json({
          msg: 'Stripe account deleted, unable to delete Subitt Account. Please contact Subitt Support.',
        });
      }
    } else {
      res.status(400).json({ msg: 'Unable to delete Stripe Account' });
    }
  } catch (err) {
    next(err);
  }
};

/*****************************
 * Function: setAccountStatus
 *
 *
 * Description: Enable an account to become inactive (soft Delete)
 *
 *
 * Inputs: params.id <- Account ID
 *
 *
 * Outputs: Nothing, but changes Account Object Status value
 *
 *
 * Use case: Make account inactive, in essence a soft delete of an account
 *
 *
 *********************** */

const setAccountStatus = async (req, res, next) => {
  try {
    const acc = await AccountModel.findById(req.accountId);
    const tar = await AccountModel.findById(req.params.id);
    const authAccount = await authorizeOperation(acc, tar);

    if (!authAccount) {
      return res.status(401).json({ err: 'Not authorized' });
    }
    let update = { currStatus: req.params.status };
    const account = await AccountModel.findByIdAndUpdate({ _id: req.params.id }, update);
    account.save().then((doc) => {
      if (doc === account) {
        res.status(200).json({ msg: 'Status Changed' });
      } else {
        res.status(400).json({ err: 'Unable to update status' });
      }
    });
  } catch (err) {
    next(err);
  }
};

/*****************************
 * Function: editPassword
 *
 *
 * Description: Change the password value
 *
 *
 * Inputs: params.id <- AccountID, body.oldPassword, body.newPassword
 *
 *
 * Outputs: Nothing, but changed password value
 *
 *
 * Use case: Change Password (on profile page)
 *
 *
 *********************** */

const editPassword = async (req, res, next) => {
  const acc = await AccountModel.findById(req.accountId); //ONLY CUSTOMER may change PASSWORD, admin cannot
  const tar = await AccountModel.findById(req.params.id);
  try {
    const authAccount = await authorizeOperation(acc, tar);
    if (!authAccount) {
      return res.status(401).json({ err: 'Not authorized' });
    }
    const oldPassCheck = await bcrypt.compare(
      req.body.oldPassword,
      (
        await AccountModel.findById(req.params.id)
      ).password,
    );
    if (!oldPassCheck) {
      return res.status(404).json({ err: 'Old Password is incorrect' });
    } else {
      const encryptedPassword = await encryptPassword(req.body.newPassword);
      if (encryptedPassword == -1)
        return res.status(404).json({ err: 'Password is null, please try again.' });
      else {
        updates = { password: encryptedPassword };
        const account = await AccountModel.findByIdAndUpdate({ _id: req.params.id }, updates);
        res.status(200).json({ msg: 'Password Updated' });
      }
    }
  } catch (err) {
    next(err);
  }
};

/*****************************
 * Function: generateAccessToken
 *
 *
 * Description: Generates a JWT token to enable access to website functionality
 *
 *
 * Inputs: accountInfo, which has email and accessJWTVersion
 *
 *
 * Outputs: JWT Access Token
 *
 *
 * Use case: Authorization
 *
 *
 *********************** */

const generateAccessToken = (accountInfo) => {
  const token = jwt.sign(
    {
      email: accountInfo.email,
      id: accountInfo._id.toString(),
      jwt_ver: accountInfo.accessjwtVersion,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' },
  );

  return token;
};

/*****************************
 * Function: generateRefreshToken
 *
 *
 * Description: generates refresh token, enabling reload to work
 *
 *
 * Inputs: accountInfo, which is email and refreshJWTVersion
 *
 *
 * Outputs: JWT refresh token
 *
 *
 * Use case: Refresh Token
 *
 *
 *********************** */

const generateRefreshToken = (accountInfo) => {
  const token = jwt.sign(
    {
      email: accountInfo.email,
      id: accountInfo._id.toString(),
      jwt_ver: accountInfo.refreshjwtVersion,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '30d' },
  );

  return token;
};

/*****************************
 * Function: updatejwtVersion
 *
 *
 * Description: Updates the JWT version, so if there is a version mismatch the JWT won't work
 *
 *
 * Inputs: account, which has accessjwtVersion and email
 *
 *
 * Outputs: Nothing, but updates AccountObject with new JWT version
 *
 *
 * Use case: Making sure old keys become invalid, reducing MITM vectors
 *
 *
 *********************** */

const updatejwtVersion = (next, account) => {
  //Need to test if this will crash
  try {
    let updates = {
      accessjwtVersion: account.accessjwtVersion + 1,
    };

    AccountModel.findOneAndUpdate({ email: account.email, status: 'Active' }, updates);
  } catch (err) {
    next(err);
  }
};

/*****************************
 * Function: updateRefreshjwtVersion
 *
 *
 * Description: Updates the refreshJWT version, since they will fall out of sync with the access JWT on occasion
 *
 *
 * Inputs: account, which is accessjwtVersion and refreshJWTversion, as well as email
 *
 *
 * Outputs: Nothing, but updates Account Object with new refresh jwt version
 *
 *
 * Use case: Updateing refresh version
 *
 *
 *********************** */

const updateRefreshjwtVersion = (next, account) => {
  try {
    let updates = {
      accessjwtVersion: account.accessjwtVersion + 1,
      refreshjwtVersion: account.refreshjwtVersion + 1,
    };
    AccountModel.findOneAndUpdate({ email: account.email, status: 'Active' }, updates);
  } catch (err) {
    next(err);
  }
};

/*****************************
 * Function: login
 *
 *
 * Description: Allows users to login to our website. Checks password and if successful, updates JWT versions, and creates JWT tokens
 *
 *
 * Inputs: body.email, password
 *
 *
 * Outputs: refresh and access tokens, ID, and role
 *
 *
 * Use case: Letting users login and interact with website
 *
 *
 *********************** */

const login = (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  let accountInfo;
  let role = false;
  AccountModel.findOne({ email: new RegExp('^' + email + '$', 'i') })
    .then((account) => {
      if (!account || account.currStatus == 'Inactive' || !account.currStatus) {
        // If account doc doesn't exist will default to false too.
        return res.status(404).json({ err: 'Account not found' });
      } else {
        if (account.role == 'admin' && account.authLevel == 'admin') {
          role = true;
        }
        accountInfo = account;
        updateRefreshjwtVersion(next, accountInfo);
        return bcrypt.compare(password, account.password);
      }
    })
    .then((matches) => {
      if (matches.statusCode == 404) {
        next();
      } else if (!matches) {
        return res.status(401).json({ err: 'Incorrect email or password' });
      } else {
        const accessToken = generateAccessToken(accountInfo);
        const refreshToken = generateRefreshToken(accountInfo);
        accountInfo.save();
        res
          .cookie('token', accessToken, { expire: 2160000 + Date.now() })
          .status(200)
          .json({
            token: accessToken,
            refreshToken: refreshToken,
            userId: accountInfo._id.toString(),
            userRole: role,
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};

/*****************************
 * Function: refresh
 *
 *
 * Description: refresh the jwtToken
 *
 *
 * Inputs: refreshJWT token
 *
 *
 * Outputs: accessToken
 *
 *
 * Use case: Refresh once the normal JWT has expired
 *
 *
 *********************** */

const refresh = (req, res, next) => {
  // Get the decoded refresh token
  try {
    let token = req.get('Authorization').split(' ')[1];
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
      if (err) {
        throw new Api401Error('Please Sign In Again');
      } else if (!result) {
        throw new Api404Error('Unable to find result');
      } else {
        return result;
      }
    });
    AccountModel.findOne({ email: decodedToken.email })
      .then((account) => {
        if (!account || account.currStatus == 'Inactive' || !account.currStatus) {
          // If account doc doesn't exist will default to false too.
          return res.status(404).json({ err: 'Account not found' });
        } else {
          accountInfo = account;
          updatejwtVersion(next, accountInfo);
          return account.refreshjwtVersion;
        }
      })
      .then((accountjwtVersion) => {
        // If the refresh token doesn't match the accounts current refresh token version, throw a 401
        if (accountjwtVersion.statusCode == 404) {
          next();
        } else if (decodedToken.jwt_ver != accountjwtVersion) {
          return res.status(401).json({ err: 'Invalid Refresh Token' });
        } else {
          const accessToken = generateAccessToken(accountInfo);
          res
            .cookie('token', accessToken, { expire: 2160000 + Date.now() })
            .status(200)
            .json({ token: accessToken, userId: accountInfo._id.toString() });
        }
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
};

/*****************************
 * Function: firstStepPasswordReset
 *
 *
 * Description: the first part of resetting the password, this just generates the link
 *
 *
 * Inputs: params.id <- accountId
 *
 *
 * Outputs: an email with a jwt to reset the password
 *
 *
 * Use case: Forgot/Reset Password
 *
 *
 *********************** */

const firstStepPasswordReset = async (req, res, next) => {
  try {
    const account = await AccountModel.findOne({ email: req.body.email });
    if (account._id) {
      const payload = { id: account._id.toString(), email: account.email };
      const secret = process.env.JWT_SECRET_KEY + account.password;
      const token = jwt.sign(payload, secret, { expiresIn: '10m' });
      const link = `${FRONT_DOMAIN}/customer/login/resetPassword/${account._id.toString()}/${token}`;
      const data = {
        username: account.username,
        email: account.email,
        link: link,
      };
      emailAPI.sendResetPasswordEmail(data);
      res.status(200).json({ doc: 'Email Sent' });
    } else {
      res.status(400).json({ msg: 'There is no account with that email address' });
    }
    //Email to email url
  } catch (err) {
    next(err);
  }
};

/*****************************
 * Function: secondStepPasswordReset
 *
 *
 * Description: the second part of resetting the password, which verifies and sets new password
 *
 *
 * Inputs: params.id <- accountId, body.newPassword <- new password to save
 *
 *
 * Outputs: nothing, but updates DB entry with new password
 *
 *
 * Use case: Forgot/Reset Password
 *
 *
 *********************** */

const secondStepPasswordReset = async (req, res, next) => {
  try {
    const account = await AccountModel.findById({ _id: req.params.id });
    if (account) {
      const secret = process.env.JWT_SECRET_KEY + account.password;
      const verify = jwt.verify(req.params.token, secret);
      if (verify) {
        const check = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\w\W]{8,}$/.test(req.body.newPassword);
        if (check) {
          const newPassword = await encryptPassword(req.body.newPassword);
          let updates = { password: newPassword };
          const updatedAccount = await AccountModel.findByIdAndUpdate(
            { _id: req.params.id },
            updates,
          );
          if (updatedAccount) {
            res.status(200).json({ msg: 'Password Reset Successfully' });
          } else {
            res.status(400).json({ msg: 'Unable to update password' });
          }
        } else {
          res
            .status(400)
            .json({ msg: 'Password must be 8 characters, have 1 capital letter and 1 number' });
        }
      }
    } else {
      res.status(400).json({ msg: 'Cannot find Account' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAccountById,
  addAccount,
  editAccount,
  deleteAccount,
  setAccountStatus,
  editPassword,
  login,
  refresh,
  firstStepPasswordReset,
  secondStepPasswordReset,
};

/*****************************
 * Function:
 *
 *
 * Description:
 *
 *
 * Inputs:
 *
 *
 * Outputs:
 *
 *
 * Use case:
 *
 *
 *********************** */
