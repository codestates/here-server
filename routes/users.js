var express = require("express");
var router = express.Router();
const {
	signup,
	signin,
	logout,
	mypage,
	fixinfo,
	userInfo,
} = require("../controllers/user");

/* GET users listing. */
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/userInfo", userInfo);
router.post("/logout", logout);
router.get("/mypage", mypage);
router.put("/mypage", fixinfo);

module.exports = router;
