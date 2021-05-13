var express = require('express');
var router = express.Router();
const keygen = require('../controller/keygenController');


router.get('/test', keygen.validate('generate') ,keygen.generate);


module.exports = router;