const { Restaurant } = require("../models");
const { getPlaceData } = require("../lib/utils");
require("dotenv").config();

module.exports = {
	get: (req, res) => {},
	post: async (req, res) => {
		try {
			getPlaceData(req.body, res);
		} catch {
			res.status(500).json({ message: "관리자에게 문의하세요" });
			res.end();
		}
	},

	put: async (req, res) => {},

	remove: (req, res) => {},
};
