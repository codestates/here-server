var express = require("express");
var router = express.Router();
const { getmatpleslike, getaroundme, getrestinfo,post, put, remove, like } = require("../controllers/restaurant");

/* GET users listing. */


router.get("/get/matpleslike", getmatpleslike);
router.get("/get/aroundme", getaroundme);
router.get("/get/restinfo/:id", getrestinfo);

router.post("/post", post);
router.put("/put", put);

router.delete("/remove", remove);
router.get("/like/:id",like);

module.exports = router;
