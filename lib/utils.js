require("dotenv").config();
const fetch = require("node-fetch");
const basicUrl = process.env.PLACE_BASIC_URL;
const { Restaurant } = require("../models");

module.exports = {
	getPlaceData: async ({ callNum, lat, lng }, res) => {
		try {
			const url = basicUrl + callNum + "&location=" + `${lat},${lng}`;
			fetch(url)
				.then((json) => json.json())
				.then(async (data) => {
					if (data.status === "OK") {
						const {
							name,
							geometry,
							formatted_address,
							photos,
							price_level,
							rating,
						} = data.results[0];

						if (!name) {
							res.status(404).send("wrong data").end();
						}
						let photoRef;
						if (!!photos) {
							photoRef = photos[0].photo_reference;
						}
						const { lat, lng } = geometry.location;
						const localAddress = formatted_address + `@${lat},${lng}`;

						if (name && lat && lng) {
							const inputData = {
								name,
								callNum,
								location: localAddress,
								photoRef,
								priceLevel: price_level || 0,
								rating: rating || 0,
								mainmenu: null,
								visit: 0,
								like: 0,
							};
							const [result, created] = await Restaurant.findOrCreate({
								where: { name },
								defaults: { ...inputData },
							}).catch((err) => res.end(err));
							if (!created) {
								res.status(409).send("already exists restaurant").end();
							} else {
								res.status(201).send(result).end();
							}
						}
					}
				});
		} catch {
			res.status(500).json({ message: "관리자에게 문의하세요" });
			res.end();
		}
	},
};
