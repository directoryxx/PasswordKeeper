const { publicEncrypt } = require('crypto');

exports.encrypt = async (req, res, next) => {
    // Validation
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    var encUrl = publicEncrypt(req.body.pubkey, req.body.url);
    var encUsername = publicEncrypt(req.body.pubkey, req.body.username);
    var encPassword = publicEncrypt(req.body.pubkey, req.body.password);

    console.log(encUrl);
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