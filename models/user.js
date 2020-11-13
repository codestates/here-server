'use strict';
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
      models.User.hasMany(models.Matzip,{foreignKey: 'userId', sourceKey:'id'})
      // define association here
    }
  };
  User.init({
    name: DataTypes.STRING,
    mobile: DataTypes.STRING,
    location: DataTypes.STRING,
    imageRef: DataTypes.STRING,
    nickname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isMatple: DataTypes.BOOLEAN,
    isFirst: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};