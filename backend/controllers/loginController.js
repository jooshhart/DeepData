/*
File Content: This file contains the login logic for subitt.
Author: Michael Hendrick
File Created Date: 200 BCE (I don't know)
=============
Revision History: 
*/
const jwt = require('jsonwebtoken');
const AccountModel = require('../models/user');

const bcrypt = require('bcrypt');

exports.createToken = async (req, res, next) => {
  try {
    //Email should be unique
    const account = await AccountModel.findOne({ email: req.body.email, status: 'Active' }).exec();

    //console.log(account,{email: req.body.user,password: req.body.password},{email: req.body.email,password: req.body.password},account.password);
    await bcrypt.compare(req.body.password, account.password).then(function (result) {
      //console.log(result);
      if (result == true) {
        token = jwt.sign(account.toJSON(), process.env.JWT_SECRET_KEY);
        res.setHeader('Set-Cookie', 'token=' + token + ';'); // Expires='+new Date(Date.now()+3600000).toGMTString()+';');
        res.cookie('token', token, { expire: 360000 + Date.now() });
        res.status(200).send({ token });
      } else {
        res.status(401).json({ err: 'Invalid credentials' });
      }
    });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
  const token = req.get('Authorization').split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    err.status = 500;
    throw err;
  }
  if (!decodedToken) {
    throw new Api401Error('Not authenticated.');
  }
  req.accountId = decodedToken.id;

  next();
};
