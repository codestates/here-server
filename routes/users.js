var express = require("express");
var router = express.Router();
const {
	signup,
	signin,
	logout,
	mypage,
	fixinfo,
	_fixData,
} = require("../controllers/user");

/* GET users listing. */
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.get("/mypage", mypage);
router.post("/mypage", fixinfo);
router.put("/mypage", _fixData);

module.exports = router;
