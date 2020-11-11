"use strict";

const crypto = require("crypto");

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
			sequelize,
			modelName: "user",
		},
		{
			hooks: {
				beforeCreate: (data) => {
					let shasum = crypto.createHash("sha256");
					shasum.update(data.password);
					data.password = shasum.digest("hex");
				},
				beforeFind: (data) => {
					let shasum = crypto.createHash("sha256");
					shasum.update(data.where.password);
					data.where.password = shasum.digest("hex");
				},
			},
		},
	);
	return user;
};
