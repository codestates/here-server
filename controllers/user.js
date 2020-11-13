const session = require("express-session");
const { User } = require("../models");

module.exports = {
	// five1star task #11
	signup: async (req, res) => {
		console.log(req.body);
		const { email, password, mobile, name } = req.body;
		const [result, create] = await User.findOrCreate({
			where: { email, password },
			defaults: {
				email,
				password,
				name,
				mobile,
				isMatple: false,
				isFirst: true,
				isActive: true,
			},
		});
		if (!create) {
			res.status(409).send("email exists").end();
		} else {
			res.status(201).send(result).end();
		}
	},

	// QuePark task #12
	// five1star modifying signin func according to tast#22
	signin: async (req, res) => {
		try {
			const { email, password } = req.body;
			const result = await User.findOne({ where: { email, password } });

			if (!!result) {
				if (result.isActive) {
					if (!req.session.userid) {
						req.session.userid = result.id;
					}
					res.status(200).send(result).end();
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

	// five1star tast #13
	logout: (req, res) => {
		req.session.userid ? req.session.destory((err) => console.log(err)) : null;
		res.redirect("../../");
	},

	// five1star tast #22
	withdrawal: async (req, res) => {
		const id = req.session.userid;
		await User.update({ isActive: false }, { where: id });

		req.session.destory((err) => console.log(err));
		res.redirect("../../");
	},
};
