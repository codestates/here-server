const { user } = require("../models");

module.exports = {
	// five1star task #11
	signup: async (req, res) => {
		console.log(req.body);
		const { email, password, mobile, username } = req.body;
		const [result, create] = await user.findOrCreate({
			where: { email, password },
			defaults: {
				email,
				password,
				username,
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
	signin: async (req, res) => {
		try {
			const { email, password } = req.body;
			const result = await user.findOne({ where: { email, password } });
			if (!!result) {
				if (!req.session.userid) {
					req.session.userid = result.id;
				}
				res.status(200);
				res.send(result);
				res.end();
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

	// five12star tast #13
	logout: (req, res) => {
		req.session.userid ? req.session.destory((err) => console.log(err)) : null;
		res.redirect("../../");
	},
};
