var express = require('express');
var router = express.Router();
const crypt = require('../controller/cryptController');


router.post('/', crypt.encrypt);


module.exports = router;