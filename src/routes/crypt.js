var express = require('express');
var router = express.Router();
const keygen = require('../controller/keygenController');
const crypt = require('../controller/cryptController');


router.post('/', crypt.encrypt);


module.exports = router;