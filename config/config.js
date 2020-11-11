const dotenv = require("dotenv");

dotenv.config();

const {
	NODE_ENV,
	NODE_USERNAME,
	NODE_PASSWORD,
	NODE_DATABASE,
	NODE_HOST,
	NODE_PORT,
} = process.env;

module.exports = {
	development: {
		username: NODE_USERNAME,
		password: NODE_PASSWORD,
		database: NODE_DATABASE,
		host: NODE_HOST,
		port: NODE_PORT,
		dialect: "mysql",
	},
	test: {
		username: "root",
		password: null,
		database: "database_test",
		host: "127.0.0.1",
		dialect: "mysql",
	},
	production: {
		username: NODE_USERNAME,
		password: NODE_PASSWORD,
		database: NODE_DATABASE,
		host: NODE_HOST,
		port: NODE_PORT,
		dialect: "mysql",
	},
};
