'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Restaurant.hasMany(models.Matzip,{foreignKey: 'restId', sourceKey:'id'})
      // define association here
    }
  };
  Restaurant.init({
    name: DataTypes.STRING,
    callNum: DataTypes.STRING,
    location: DataTypes.STRING,
    photoRef: DataTypes.STRING,
    priceLevel: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    mainmenu: DataTypes.STRING,
    visit: DataTypes.INTEGER,
    like: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};