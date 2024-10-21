const bcrypt = require('bcrypt');

const encryptPassword = async (password) => {
  if (!password || password == null) {
    // If the user hasn't inputted a password we will send an error message to them,
    // The -1 here is for the login controller to check that case
    return -1;
  } else {
    // If they have inputted a password, salt and hash it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
};

module.exports = { encryptPassword };
