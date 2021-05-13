const { sequelize } = require('../db/models');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const { generateKeyPair } = require('crypto');
const fse = require('fs-extra')

exports.generate = async (req, res, next) => {
    // Validation
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let downloadable = (req.body.downloadable === undefined || req.body.downloadable == "" || req.body.downloadable != 1) ? false : true; 
    let passphrase = (req.body.keyphrase === undefined || req.body.keyphrase == "") ? '' : req.body.keyphrase; 

    generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "spki",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
            cipher: "aes-256-cbc",
            passphrase
        }
    }, (err, publicKey, privateKey) => {
        // Handle errors and use the generated key pair.
        if(downloadable){
            const dir = './temp/'+req.user.uuid;
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            fs.writeFile('./temp/'+req.user.uuid+'/public-'+req.user.uuid, publicKey, function (err) {
            if (err) return console.log(err);
                console.log('Hello World > helloworld.txt');
            });
            fs.writeFile('./temp/'+req.user.uuid+'/private-'+req.user.uuid, privateKey, function (err) {
            if (err) return console.log(err);
                console.log('Hello World > helloworld.txt');
            });
            res.zip({
                files: [{
                    path: './temp/'+req.user.uuid,
                    name: 'Priv&Pub'
                }],
                filename: 'GeneratedKey.zip'
            }).then(function() {
                fse.emptyDirSync(dir);
            });
        } else {
            res.status(200).send({
                status: res.statusCode,
                publicKey: publicKey,
                privateKey: privateKey
            });
        }

    });
    
        
   
}

exports.validate = (method) => {
  switch (method) {
    case 'generate': {
        return [ 
            body('downloadable').isBoolean().optional({nullable:true}),
            body('keyphrase').optional({ nullable: true }),
        ];   
    }

    
  }
}