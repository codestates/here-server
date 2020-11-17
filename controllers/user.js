const { User, Matzip } = require("../models");
const { getLatLng } = require("../lib/utils");

module.exports = {
	// post function
	signup: async (req, res) => {
		console.log(req.body);
		const { email, password, mobile, name, location } = req.body;
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
					res.cookie("userInfo", JSON.stringify(userInfo), { httpOnly: true });
					res.status(308).send().redirect("/");
				} else {
					res.status(409).send("탈퇴한 유저입니다").end();
				}
			} else {
				res.status(404);
				res.cookie("userInfo", JSON.stringify({ email: email }), {
					httpOnlyu: true,
				});
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
		req.session.destory((err) => console.log(err));
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
			// res.cookie("restInfo", JSON.stringify(restInfo), { httpOnly: true });
			res.status(200).send(restInfo).end();
		} catch {
			res.status(500).json({ message: "관리자에게 문의하세요" });
			res.end();
		}
	},
	// put function
	fixinfo: async (req, res) => {
		res.send("mypage/fixinfo");
	},
};
