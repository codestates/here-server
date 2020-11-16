const { Restaurant,Matzip } = require("../models");
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
	
	//five1star #task39, put func
  //무엇까지 수정할수있게? name, callNum, location은 검색에 사용되기때문에 변경하면 안된다.
  //식당 visit과 likes는 Matzips 테이블과 함께 움직여아하기때문에 레스토랑 정보에서 바로 바꾸면 안된다. 
	//put으로 자유롭게 바꿀 수 있는것은 mainmenu정도.
	put: async (req, res) => {
		try {
			if(!req.session.userId){
				res.status(201).send('먼저 로그인을 해주세요')
			} else {
					const { id,mainmenu } = req.body;
					await Restaurant.update({mainmenu},{where:{id:Number(id)}})
  				let result = await Restaurant.findOne({where:{id}});
					res.status(200).send(result);
			}
		}	catch {
			res.status(500).json({ message: "관리자에게 문의하세요" });
			res.end();
		}
  },

	//five1star #task40, remove func. change 'isActive' to 'false'
	remove: async (req, res) => {
		try {
			if(!req.session.userId){
				res.status(201).send('먼저 로그인을 해주세요')
			} else {
					const { id } = req.body;
  				let result = await Restaurant.update({isActive:isActive},{where:{id:Number(id)}});
					res.status(200).send(result);
			}
		}	catch {
			res.status(500).json({ message: "관리자에게 문의하세요" });
			res.end();
		}
	},
 	//five1star #task41, make row at Matzip tables
	like: async (req,res)=>{
		try {
			if(!req.session.userId){
				res.status(201).send('먼저 로그인을 해주세요')
			} else {
					const userId = req.session.userid;
					const restId = req.params.id;
					await Matzip.create({like:true,userId,restId});
					let result = Matzip.findOne({
					attribute:[like],	
					where:{userId,restId}})
					res.status(200).send(result);
			}
		}	catch {
			res.status(500).json({ message: "관리자에게 문의하세요" });
			res.end();
		}
	}
}