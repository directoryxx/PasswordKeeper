const { publicEncrypt } = require('crypto');
require('buffer').Buffer;
const { sequelize } = require('../db/models');

exports.encrypt = async (req, res, next) => {
    const user = req.user;

    console.log(typeof req.body.url);
    var encUrl = publicEncrypt(req.body.pubkey, Buffer.from(req.body.url));
    var encUsername = publicEncrypt(req.body.pubkey, Buffer.from(req.body.username));
    var encPassword = publicEncrypt(req.body.pubkey, Buffer.from(req.body.password));

    const vault = sequelize.models.Vault;
      
    vault.create({
        url: encUrl,
        username: encUsername,
        password: encPassword,
        UserId: user.id,
    }).then(function(vault){
      // const token = user.generateToken();
      res.status(201).send({
          status: res.statusCode,
          success: true
      });
    });
}


exports.validate = (method) => {
  switch (method) {
    case 'encrypt': {
        return [ 
            body('keyphrase').optional({ nullable: true }),
            body('pubkey').optional({ nullable: true }),
            body('url').isString().trim().escape(),
            body('username').isString().trim().escape(),
            body('password').isString().trim().escape(),
            body('note').optional({ nullable: true }),
        ];   
    }

    
  }
}