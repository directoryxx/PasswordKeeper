'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vault extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vault.belongsTo(models.User);
    }
  };
  Vault.init({
    url: DataTypes.BLOB('long'),
    username: DataTypes.BLOB('long'),
    password: DataTypes.BLOB('long'),
    UserId: DataTypes.INTEGER,
    notes: DataTypes.BLOB('long')
  }, {
    sequelize,
    modelName: 'Vault',
  });
  return Vault;
};