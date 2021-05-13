'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Vault);
    }
  };

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.prototype.generateToken = function () {
    const token = jwt.sign({ id: this.uuid }, process.env.JWT_SECRET , {
        expiresIn: 86400 // expires in 24 hours
    });

    return token;
  };

  User.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
  
    delete values.password;
    return values;
  };

  User.init({
    name: DataTypes.STRING,
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        // Storing passwords in plaintext in the database is terrible.
        // Hashing the value with an appropriate cryptographic hash function is better.
        this.setDataValue('password', bcrypt.hashSync(value, process.env.SALT));
      }
    },
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  },{
    instanceMethods: {
      validPassword: async function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }
  });
  
  return User;
};