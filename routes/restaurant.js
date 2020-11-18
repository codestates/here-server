var express = require("express");
var router = express.Router();
const {
	matpleslike,
	aroundme,
	getrestinfo,
	post,
	put,
	remove,
	like,
} = require("../controllers/restaurant");

/* GET users listing. */

router.get("/matpleslike", matpleslike);
router.get("/aroundme", aroundme);
router.get("/restinfo/:id", getrestinfo);

router.post("/post", post);
router.put("/put", put);

router.delete("/remove", remove);
router.get("/like/:id", like);

module.exports = router;
