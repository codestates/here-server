const { Restaurant } = require("../models");
const { getPlaceData } = require("../lib/utils");
const { Op } = require("sequelize");
require("dotenv").config();

module.exports = {
	//five1star #task42, sending '9' restaurant information (temp)
	get: async (req, res) => {
		try {
			let result = await Restaurant.findAll({
			where:{id:{[Op.lt]:10}}
			})
			res.status(200).send(result).end();
		} catch {
			res.status(500).json({ message: "관리자에게 문의하세요" });
			res.end();
		}
	},
	post: async (req, res) => {
		try {
			getPlaceData(req.body, res);
		} catch {
			res.status(500).json({ message: "관리자에게 문의하세요" });
			res.end();
		}
	},

	put: async (req, res) => {},

	//five1star #task40, remove func. change 'isActive' to 'false'
	remove: async (req, res) => {
		try {
			if(!req.session.userId){
				res.status(201).send('먼저 로그인을 해주세요')
			} else {
					//remove:id로 받아  req.params로 전달하는게 나은지에 대해서
					const { id } = req.body;
					//여기서 isActive가 false로 바뀌지 않음
					await Restaurant.update({isActive:false},{where:{id:Number(id)}})
  				let result = await Restaurant.findOne({where:{id}});
					res.status(200).send(result);
				}
		}	catch {
			res.status(500).json({ message: "관리자에게 문의하세요" });
			res.end();
			}
	}
}