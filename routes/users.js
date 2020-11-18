var express = require("express");
var router = express.Router();
const {
	signup,
	signin,
	logout,
	mypage,
	fixinfo,
} = require("../controllers/user");

/* GET users listing. */
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.get("/mypage", mypage);
router.put("/mypage", fixinfo);

module.exports = router;
