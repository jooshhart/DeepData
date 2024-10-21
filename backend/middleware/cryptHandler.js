const CryptoJS = require('crypto-js');
require('dotenv').config();

const encryptText = (rawText) => {
  //"Simple" encryption
  return CryptoJS.AES.encrypt(rawText, `${process.env.ENCRYPT_KEY}`).toString();
};
const decryptText = (ciphertext) => {
  //"Simple" Decryption
  return CryptoJS.AES.decrypt(ciphertext, `${process.env.ENCRYPT_KEY}`).toString(CryptoJS.enc.Utf8);
};
const compareText = (encryptLHS, encryptRHS) => {
  //decrypt both texts and see if the decrypted versions match, useful if the same info has been encrypted multiple times,
  return decryptText(encryptLHS) === decryptText(encryptRHS); //as the encrypted strings should never match, but decrypted would
};
module.exports = {
  encryptText,
  decryptText,
  compareText,
};
