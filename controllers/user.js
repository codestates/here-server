const session = require("express-session");
const { User } = require("../models");
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
					delete result.password;
					res.status(201).send(result).end();
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
					if (!req.session.userid) {
						req.session.userid = userInfo.id;
					}
					delete userInfo.password;
					req.session.userInfo = { ...userInfo };
					res.status(308).redirect("/");
				} else {
					res.status(409).send("탈퇴한 유저입니다").end();
				}
			} else {
				res.status(302);
				req.session.email = email;
				res.redirect("../signup");
				res.end();
			}
		} catch {
			res
				.status(err.status || 500)
				.json({ message: err.message || "관리자에게 문의하세요" });
			res.end();
		}
	},
	// post function
	logout: (req, res) => {
		req.session.userid ? req.session.destory((err) => console.log(err)) : null;
		res.redirect("../../");
	},
	// not use function, post function
	withdrawal: async (req, res) => {
		const id = req.session.userid;
		await User.update({ isActive: false }, { where: id });

		req.session.destory((err) => console.log(err));
		res.redirect("../../");
	},
	// get function
	mypage: async (req, res) => {
		const id = req.session.userid;
		const userInfo = await User.findOne({
			where: { id },
			attributes: { exclude: ["password"] },
		});
		res.status(200).send(userInfo).end();
	},
	// put function
	fixinfo: async (req, res) => {
		res.send("mypage/fixinfo");
	},
};
