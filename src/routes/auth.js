const express = require('express');
const router = express.Router();
const auth = require('../controller/authController');

router.post('/login', auth.validate('userLogin'), auth.login);
router.post('/register', auth.validate('userCreate'), auth.register);

module.exports = router;