const { publicEncrypt, privateDecrypt } = require('crypto');
require('buffer').Buffer;
const { sequelize } = require('../db/models');

exports.encrypt = async (req, res, next) => {
    const user = req.user;

    try {
      let encUrl = await publicEncrypt(req.body.pubkey, Buffer.from(req.body.url));
      let encUsername = await publicEncrypt(req.body.pubkey, Buffer.from(req.body.username));
      let encPassword = await publicEncrypt(req.body.pubkey, Buffer.from(req.body.password));
  
      const vault = sequelize.models.Vault;
        
      vault.create({
          url: encUrl,
          username: encUsername,
          password: encPassword,
          UserId: user.id,
      }).then(function(vault){
        res.status(201).send({
            status: res.statusCode,
            success: true
        });
      });
    } catch (err){
      res.status(422).send({
          status: res.statusCode,
          success: false,
          error: err,
      });
    }

}

exports.decrypt = async (req, res, next) => {
  const user = req.user;

  const vault = req.vault;

  const init = sequelize.models.Vault;

  if(user.id != vault.UserId){
    res.status(404).send({
        status: res.statusCode,
        success: false,
        messages: 'Not Found',
    });
  }

  try {
    let decUrl = await privateDecrypt({
      key: req.body.privKey,
      passphrase: '',
    },vault.url);
  
  
    let decUsername = await privateDecrypt({
      key: req.body.privKey,
      passphrase: '',
    },vault.username);
  
  
    let decPassword = await privateDecrypt({
      key: req.body.privKey,
      passphrase: '',
    },vault.password);
  
    
    res.status(200).send({
        status: res.statusCode,
        success: true,
        url: decUrl.toString(),
        username: decUsername.toString(),
        password: decPassword.toString(),
    });  
  } catch(e){
    res.status(422).send({
        status: res.statusCode,
        success: false,
        error: e,
    });
  }
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