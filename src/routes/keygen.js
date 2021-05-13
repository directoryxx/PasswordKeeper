var express = require('express');
var router = express.Router();
const keygen = require('../controller/keygenController');


router.get('/', keygen.validate('generate') ,keygen.generate);


module.exports = router;