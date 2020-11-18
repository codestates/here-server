const session = require("express-session");
const { User, Matzip } = require("../models");
const { getLatLng, checkUser } = require("../lib/utils");

module.exports = {
	// post function
	signup: async (req, res) => {
		console.log(req.body);
		let { email, password, mobile, name, location } = req.body;
		if (!mobile || !name || !location) {
			mobile = "010-0000-0000";
			name = "두루미";
			location = "서울특별시 용산구";
		}
		getLatLng(location)
			.then(async (promiseResult) => {
				const { lat, lng } = promiseResult;
				const locationData = `${location}@${lat},${lng}`;
				const [result, create] = await User.findOrCreate({
					where: { email, password },
					defaults: {
						email,
						password,
						name,
						mobile,
						location: locationData,
						isMatple: false,
						isFirst: true,
						isActive: true,
					},
				});
				if (!create) {
					res.status(409).send("email exists").end();
				} else {
					result.password = null;
					res.status(201).end();
				}
			})
			.catch((err) => console.log(err));
	},
	// post function
	signin: async (req, res) => {
		try {
			const { email, password } = req.body;
			const userInfo = await User.findOne({ where: { email, password } });

			if (!!userInfo) {
				if (userInfo.isActive) {
					userInfo.password = null;
					res.cookie("userInfo", JSON.stringify(userInfo), {
						// sameSite: "none",
						domain: "soltylink.com",
						secure: true,
					});
					res.status(200).send(userInfo).end();
				} else {
					res.status(409).send("탈퇴한 유저입니다").end();
				}
			} else {
				res.cookie("userInfo", JSON.stringify({ email: email }), {
					domain: "soltylink.com",
					httpOnly: true,
				});
				res.status(404);
				res.end();
			}
		} catch {
			res.status(500).json({ message: "관리자에게 문의하세요" });
			res.end();
		}
	},
	// post function
	logout: (req, res) => {
		res.clearCookie("userInfo");
		// req.session.destory((err) => console.log(err));
		res.redirect("../../");
	},
	// not use function, post function
	withdrawal: async (req, res) => {
		const userInfo = JSON.parse(req.cookies.userInfo);
		const id = userInfo.id;
		await User.update({ isActive: false }, { where: id });
		res.clearCookie("userInfo");
		req.session.destory((err) => console.log(err));
		res.redirect("../../");
	},
	// get function
	mypage: async (req, res) => {
		try {
			console.log(req.headers);
			console.table(req.cookies);
			const reqUserInfo = JSON.parse(req.cookies.userInfo);
			const id = reqUserInfo.id;
			const restInfo = await Matzip.findAll({
				where: { userId: id },
				include: [{ all: true }],
				orders: [
					["like", "DESC"],
					["visit", "DESC"],
				],
				// limit: 100,
				attributes: { exclude: ["password"] },
			});
			// console.log(restInfo);
			// res.cookie("restInfo", JSON.stringify(restInfo), { sameSite: "none", httpOnly: true });
			res.status(200).send(restInfo).end();
		} catch {
			res.status(500).json({ message: "관리자에게 문의하세요" });
			res.end();
		}
	},
	// put function
	fixinfo: async (req, res) => {
		try {
			const reqUserInfo = JSON.parse(req.cookies.userInfo);
			reqUserInfo.password = req.body.password;
			console.log(reqUserInfo);
			console.log(req.body);
			if (checkUser(reqUserInfo)) {
				const {
					id,
					email,
					password,
					location,
					name,
					nickname,
					mobile,
					imageRef,
				} = reqUserInfo;
				const {
					inputEmail,
					inputPassword,
					inputLocation,
					inputName,
					inputNickname,
					inputMobile,
					inputImageRef,
				} = req.body;
				let newLocation;
				// if (location.split("@")[0] !== inputLocation) {
				// 	const getLocation = async (location) => {
				// 		const [lat, lng] = await getLatLng(inputLocation);
				// 		const result = `${location}@${lat},${lng}`;
				// 		return result;
				// 	};
				// 	newLocation = getLocation(inputLocation);
				// } else {
				// 	newLocation = location;
				// }
				const modifyUserInfo = {
					email: inputEmail || email,
					password: inputPassword || password,
					location: newLocation,
					name: inputName || name,
					nickname: inputNickname || nickname,
					mobile: inputMobile || mobile,
					imageRef: inputImageRef || imageRef,
				};

				await User.update(modifyUserInfo, {
					individualHooks: true,
					where: { id },
				});
				//
				res.clearCookie("userInfo");
				modifyUserInfo.password = null;
				res.cookie("userInfo", JSON.stringify(modifyUserInfo), {
					sameSite: "none",
					domain: "here.soltylink.com",
					httpOnly: true,
				});
				res.status(200).end();
			}
		} catch {
			res.status(500).json({ message: "관리자에게 문의하세요" });
			res.end();
		}
	},
};
