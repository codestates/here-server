'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Matzip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Matzip.belongsTo(models.User,{foreignKey: 'userId', targetKey:'id'})
      models.Matzip.belongsTo(models.Restaurant,{foreignKey: 'restId', targetKey:'id'})
    }
  };
  Matzip.init({
    like: DataTypes.BOOLEAN,
    count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Matzip',
  });
  return Matzip;
};