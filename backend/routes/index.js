const router = require('express').Router();

router.use(
    '/user',
    require('./user'),
    // #swagger.tags = ["Accounts"]
  );

router.use('/login', require('./login') /*#swagger.ignore = true*/);

