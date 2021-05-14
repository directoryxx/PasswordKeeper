const jwt = require('jsonwebtoken')
const { sequelize } = require('../db/models');

const authUser = async (req, res, next) => {
  try {
    // getTokenFromHeader
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log(token);
    // verifyToken
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    
    const init = sequelize.models.User;
    const user = await init.findOne({ where: { uuid: decoded.id } });
    
    if (!user) {
      throw new Error('user not found');
    }

    delete user.password;
    
    req.token = token
    req.user = user
    next();
  } catch (error) {
    res.status(401).send({
      status: res.statusCode,
      messages: 'Authorization Failed!, Token is Not Valid',
    })
  }
}

module.exports = authUser