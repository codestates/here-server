const session = require("express-session");
const { User, Matzip, Restaurant } = require("../models");
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
					if (!req.session.userid) {
						req.session.userid = userInfo.id;
					}
					res.cookie("userid", JSON.stringify(userInfo.id), {
						domain: "soltylink.com",
						secure: true,
						httpOnly: true,
						path: "/",
					});

					res.status(200).send(userInfo).end();
				} else {
					res.status(409).send("탈퇴한 유저입니다").end();
				}
			} else {
				res.cookie("email", JSON.stringify({ email: email }), {
					domain: "soltylink.com",
					httpOnly: true,
				});
				res.status(404);
				res.end();
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "관리자에게 문의하세요" });
			res.end();
		}
	},
	// post function
	logout: (req, res) => {
		try {
			// console.log("AAAAAA");
			// res.clearCookie("userInfo");
			console.log("BBBBBB");
			console.log(" ---- session: ", req.session);
			console.log(" ---- cookies: ", req.cookies);
			res.clearCookie("userid");
			req.session = null;
			console.log(req.session);
			res.redirect("./signin");
			console.log("CCCCCC");
			res.status(201).send("Success").end();
		} catch (err) {
			res.status(500).json({ message: err.message || "관리자에게 문의하세요" });
			res.end();
		}
	},
	// not use function, post function
	withdrawal: async (req, res) => {
		const userInfo = JSON.parse(req.cookies.userInfo);
		const id = userInfo.id;
		await User.update({ isActive: false }, { where: id });
		res.clearCookie("userInfo");
		req.session.destory();
		res.redirect("../../");
	},
	// get function
	mypage: async (req, res) => {
		try {
			// console.log(req.headers);
			// console.log("cookies", req.cookies);
			// if (!req.cookies.userInfo) {
			// 	res.status(404).send("cookie is undefined").end();
			// }
			console.log(req.session);
			// const reqUserInfo = JSON.parse(req.cookies.userInfo);
			// const id = reqUserInfo.id;
			const id = req.session.userid;
			const restInfo = await Matzip.findAll({
				where: { userId: id },
				include: [{ all: true }],
				orders: [
					["like", "DESC"],
					["visit", "DESC"],
				],
				// limit: 50,
			});
			restInfo.forEach((matzip) => {
				matzip.User.password = null;
			});
			// restInfo.User.password = null;
			// console.log(restInfo);
			// res.cookie("restInfo", JSON.stringify(restInfo), { sameSite: "none", httpOnly: true });
			res.status(200).send(restInfo).end();
		} catch (err) {
			res.status(500).json({ message: err.message || "관리자에게 문의하세요" });
			res.end();
		}
	},
	// put function
	fixinfo: async (req, res) => {
		try {
			const userid = req.session.userid;
			const userInfo = await User.findOne({ where: { id: userid } });
			userInfo.password = req.body.password;
			// const reqUserInfo = JSON.parse(req.cookies.userInfo);
			// reqUserInfo.password = req.body.password;
			console.log(reqUserInfo);
			console.log(req.body);
			// if (checkUser(userInfo)) {
			if (userInfo) {
				const {
					id,
					email,
					password,
					location,
					name,
					nickname,
					mobile,
					imageRef,
				} = userInfo;
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
				if (location.split("@")[0] !== inputLocation) {
					const getLocation = async (location) => {
						const [lat, lng] = await getLatLng(inputLocation);
						const result = `${location}@${lat},${lng}`;
						return result;
					};
					newLocation = getLocation(inputLocation);
				} else {
					newLocation = location;
				}
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

				// res.clearCookie("userid");
				// modifyUserInfo.password = null;
				// res.cookie("userInfo", JSON.stringify(modifyUserInfo), {
				// 	sameSite: "none",
				// 	domain: "here.soltylink.com",
				// 	httpOnly: true,
				// });
				res.status(200).end();
			}
		} catch (err) {
			res.status(500).json({ message: err.message || "관리자에게 문의하세요" });
			res.end();
		}
	},
};
