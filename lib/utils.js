require("dotenv").config();
const fetch = require("node-fetch");
const user = require("../controllers/user");
const basicUrl = process.env.PLACE_BASIC_URL;
const { Restaurant, User } = require("../models");
const jwt = require('jsonwebtoken');


module.exports = {
	getPlaceData: async ({ callNum, lat, lng }, res) => {
		try {
			const url = basicUrl + callNum + "&location=" + `${lat},${lng}`;
			fetch(url)
				.then((json) => json.json())
				.then(async (data) => {
					if (data.status === "OK" && data.results.length > 0) {
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
								rating: rating * 10 || 0,
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

	// it return promise
	getLatLng: (strAddress) => {
		const url = process.env.GEOCODING_BASIC_URL + encodeURI(strAddress);
		return fetch(url)
			.then((json) => json.json())
			.then((data) => {
				return data.results[0].geometry.location;
			})
			.catch((err) => {
				console.log(err);
			});
	},

	checkUser: async (userInfo) => {
		const { id, email, password } = userInfo;
		try {
			let result = await User.findOne({ where: { id, email, password } });
			return result;
		} catch {
			return false;
		}
	},
	verifyToken: (req,res,next)	=>	{
  	const accessToken = req.cookies['accessToken'];
		const refreshToken = req.cookies['refreshToken'];
  	if(typeof bearerHeader !== 'undeined'){
    	req.accessToken = accessToken;
			req.refreshToken = refreshToken;
    	next();
  	} else {
    	res.send('여기서에러났쪄요')
    }
  },

	tokenCheck: async (req,res,next) =>{
		let authData = await jwt.verify(req.accessToken, process.env.JWT_PUBLIC, (err,authData)=> {
				if(err){
					res.clearCookie("accessToken")
					return 
				} else { 
						console.log('아직 유효함'); 
						return authData }
			})

				if(typeof authData === 'undefined') {

			let checkoutRefreshToken = await jwt.verify(req.refreshToken, process.env.JWT_PUBLIC, (err,authData)=> (err)?res.send('리프레시 토큰도 만료'):authData)
		
			const tempObj = { ...checkoutRefreshToken }

			let result = jwt.sign({id:tempObj.id},process.env.JWT_PUBLIC,{expiresIn:'5s'})
				res.cookie("accessToken",result);
				req.id = tempObj.id;
				next()

   } else {
		req.id = authData.id;
		next()
			}
	},
	getLocation: async (location) => {
		const [lat, lng] = await getLatLng(location);
		const result = `${location}@${lat},${lng}`;
		return result;
	};
};
