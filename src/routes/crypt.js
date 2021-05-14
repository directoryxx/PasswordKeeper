var express = require('express');
var router = express.Router();
const keygen = require('../controller/keygenController');
const crypt = require('../controller/cryptController');
const { sequelize } = require('../db/models');

// Route Binding 
router.param('crypt', function(req, res, next) { 
    // if ":user" placeholder in any of the router's route definitions 
    // it will be intercepted by this middleware 

    const init = sequelize.models.Vault;

    const vault = init.findOne({ where: { id: req.params.crypt } }).then(function (vault) {
        if(vault){
            req.vault = vault;     
            next();
        } else {
            res.status(404).send({
                status: res.statusCode,
                success: false,
                messages: 'Not Found',
            });
        }

    }).catch((error) => {
        res.status(404).send({
            status: res.statusCode,
            success: false,
            messages: 'Not Found',
        });
    });
}); 

router.post('/enc', crypt.encrypt);
router.post('/dec/:crypt', crypt.decrypt);



module.exports = router;