const express = require('express');
const router = express.Router();

const authHelper = require('../config/auth');

router.use(authHelper.verifyJwtToken,authHelper.userProfile);



module.exports = router;
