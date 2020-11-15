var express = require("express");
var router = express.Router();
const { get, post, put, remove,like } = require("../controllers/restaurant");

/* GET users listing. */
router.get("/get", get);
router.post("/post", post);
router.put("/put", put);
router.delete("/remove", remove);
router.get("/like/:id",like);

module.exports = router;
