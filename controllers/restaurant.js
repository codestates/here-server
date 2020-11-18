const { Restaurant, Matzip, User } = require("../models");
const { getPlaceData } = require("../lib/utils");
const { Op } = require("sequelize");
const { constants } = require("crypto");
require("dotenv").config();

module.exports = {
	//five1star #task42, sending '9' restaurant information (temp)
	// get: async (req, res) => {
	// 	try {
	// 		let result = await Restaurant.findAll({
	// 		where:{id:{[Op.lt]:10}}
	// 		})
	// 		res.status(200).send(result).end();
	// 	} catch (err) {
	// 		res.status(500).json({ message: err.message || "관리자에게 문의하세요" });
	// 		res.end();
	// 	}
	// },
	matpleslike: async (req, res) => {
		try {
			let result = await Restaurant.findAll({
				include: [
					{
						model: Matzip,
						where: {
							userId: 6,
						},
					},
				],
				limit: 4,
			});
			res.status(201).send(result).end();
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: err.message || "관리자에게 문의하세요" });
			res.end();
		}
	},

	aroundme: async (req, res) => {
		try {
			console.log(req.headers);
			console.log(req.cookies);
			const { id } = req.cookies.userInfo;
			const { location } = await User.findOne({
				attributes: ["location"],
				where: { id },
			});

			let adress = !location ? ["서울", "영등포"] : location.split(" ");

			if (adress[0] === "서울") {
				const result = await Restaurant.findAll({
					where: {
						location: { [Op.like]: `대한민국 서울특별시 ${adress[1]}%` },
					},
					order: [["like", "DESC"]],
					limit: 4,
				});
				res.status(201).send(result).end();
			} else if (adress[0] === "경기") {
				result = await Restaurant.findAll({
					where: {
						location: { [Op.like]: `대한민국 경기도 ${adress[1]}%` },
					},
					order: [["like", "DESC"]],
					limit: 4,
				});
				res.status(201).send(result);
			} else {
				result = await Restaurant.findAll({
					where: {
						location: { [Op.like]: `대한민국 서울특별시 종로구%` },
					},
					order: [["like", "DESC"]],
					limit: 4,
				});
				res.status(201).send(result).end();
			}
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: err.message || "관리자에게 문의하세요" });
			res.end();
		}
	},

	getrestinfo: async (req, res) => {
		try {
			const userId = req.session.userid;
			const { id } = req.params;

			let result = await Restaurant.findOne({ where: { id } });
			let temp = result.visit + 1;
			await Restaurant.update({ visit: temp }, { where: { id } });

			let sendingData = await Restaurant.findOne({ where: { id } });
			let result2 = await Matzip.findOne({ where: { userId, restId: id } });

			if (result2) {
				sendingData = { sendingData, iLike: true };
				res.status(201).send(sendingData).end();
			} else {
				sendingData = { sendingData, iLike: false };
				res.status(201).send(sendingData).end();
			}
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: err.message || "관리자에게 문의하세요" });
			res.end();
		}
	},

	//five1star #task39, put func
	put: async (req, res) => {
		try {
			const { id, mainmenu } = req.body;
			await Restaurant.update({ mainmenu }, { where: { id: Number(id) } });
			let result = await Restaurant.findOne({ where: { id } });
			res.status(200).send(result).end();
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: err.message || "관리자에게 문의하세요" });
			res.end();
		}
	},

	//five1star #task40, remove func. change 'isActive' to 'false'
	remove: async (req, res) => {
		try {
			const { id } = req.body;
			let result = await Restaurant.update(
				{ isActive: isActive },
				{ where: { id: Number(id) } },
			);
			res.status(20).send(result).end();
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: err.message || "관리자에게 문의하세요" });
			res.end();
		}
	},

	//five1star #task41, make row at Matzip tables
	like: async (req, res) => {
		try {
			const userId = req.session.userid;
			const id = req.body.id;
			await Matzip.create({ like: true, userId, restId: id });
			let result = await Restaurant.findOne({ where: { id } });
			let temp = result.like + 1;
			let isSuccess = Restaurant.update({ like: temp }, { where: { id } });

			if (isSuccess) {
				res.status(201).send({ iLike: true }).end();
			} else {
				throw err;
			}
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: err.message || "관리자에게 문의하세요" });
			res.end();
		}
	},

	//admin only method
	post: async (req, res) => {
		try {
			getPlaceData(req.body, res);
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: err.message || "관리자에게 문의하세요" });
			res.end();
		}
	},
};
