const { publicEncrypt } = require('crypto');

exports.encrypt = async (req, res, next) => {
    // Validation
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    var encrypted = publicEncrypt(publicKey, buffer);

    
    
        
   
}