var express = require("express");
var router = express.Router();
const { signup, signin, logout } = require("../controllers/user");

/* GET users listing. */
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);

module.exports = router;
