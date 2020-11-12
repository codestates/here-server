"use strict";

const crypto = require("crypto");
const dotenv = require("dotenv");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class user extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	user.init(
		{
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			mobile: DataTypes.STRING,
			location: DataTypes.STRING,
			latitude: DataTypes.STRING,
			longitude: DataTypes.STRING,
			isMatple: DataTypes.BOOLEAN,
			isFirst: DataTypes.BOOLEAN,
			isActive: DataTypes.BOOLEAN,
		},
		{
			hooks: {
				beforeCreate: (data) => {
					console.log(data);
					if (!!data.password) {
						data.password = crypto
							.createHmac("sha256", data.password + process.env.JWT_PUBLIC)
							.digest("hex");
					}
				},
				beforeFind: (data) => {
					if (!!data.where.password) {
						data.where.password = crypto
							.createHmac(
								"sha256",
								data.where.password + process.env.JWT_PUBLIC,
							)
							.digest("hex");
					}
				},
			},
			sequelize,
			modelName: "user",
		},
	);
	return user;
};
