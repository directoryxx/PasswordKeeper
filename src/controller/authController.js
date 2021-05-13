const { sequelize } = require('../db/models');
const { body, validationResult } = require('express-validator');

exports.login = async (req, res, next) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let email = req.body.email;
    let password = req.body.password;
    const init = sequelize.models.User;
            
    const user = init.findOne({ where: { email: email } }).then(function (user) {
        if (!user) {
            throw new Error('Email atau password salah');
        } else if (!user.validPassword(password)) {
            throw new Error('Email atau password salah');
        } else {
            const token = user.generateToken();
            res.status(200).send({
                status: res.statusCode,
                success: true,
                messages: 'Auth successfully!',
                token: token,
            });
        }
    }).catch((error) => {
        res.status(422).send({
            status: res.statusCode,
            success: false,
            messages: 'Cannot find the credentials',
        });
    });
}

exports.register = async (req, res) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = sequelize.models.User;
      
      user.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
      }).then(function(user){
        const token = user.generateToken();
        res.status(201).send({
            status: res.statusCode,
            success: true,
            messages: 'New user created!',
            token: token,
        });
      });
      
      
    } catch (error) {
      console.log(error)
      res.status(400).send({
        status: res.statusCode,
        success: false,
        messages: 'Failed to register a new user!',
        error : error.getMessage(),
      })
    }
  }

exports.validate = (method) => {
  switch (method) {
    case 'userLogin': {
        return [ 
            body('email').isEmail().normalizeEmail(),
            body('password').isLength({ min: 5 }),
        ];   
    }

    case 'userCreate': {
        return [ 
            body('email').custom(value => {
                const init = sequelize.models.User;
            
                const user = init.findOne({ where: { email: value } }).then(function (user) {
                    if(user){
                        return Promise.reject('E-mail already in use');
                    }
                });

                return user;
            }),
            body('password').isLength({ min: 5 }),
            body('name').isLength({ min: 5 }),
        ];   
    }
  }
}