"use strict";
const { Model } = require("sequelize");
const crypto = require("crypto");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			models.User.hasMany(models.Matzip, {
				foreignKey: "userId",
				sourceKey: "id",
			});
			// define association here
		}
	}

	User.init(
		{
			name: DataTypes.STRING,
			mobile: DataTypes.STRING,
			location: DataTypes.STRING,
			imageRef: DataTypes.STRING,
			nickname: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			isMatple: DataTypes.BOOLEAN,
			isFirst: DataTypes.BOOLEAN,
			isActive: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: "User",
		},
	),
		User.beforeCreate((data) => {
			console.log(data);
			if (!!data.password) {
				data.password = crypto
					.createHmac("sha256", data.password + process.env.JWT_PUBLIC)
					.digest("hex");
			}
		}),
		User.beforeFind((data) => {
			if (!!data.where.password) {
				data.where.password = crypto
					.createHmac("sha256", data.where.password + process.env.JWT_PUBLIC)
					.digest("hex");
			}
		}),
		User.beforeUpdate((data) => {
			if (!!data.password) {
				data.password = crypto
					.createHmac("sha256", data.password + process.env.JWT_PUBLIC)
					.digest("hex");
			}
		});
	return User;
};
