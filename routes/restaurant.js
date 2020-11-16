var express = require("express");
var router = express.Router();
const { get, post, put, remove } = require("../controllers/restaurant");

/* GET users listing. */
router.get("/get", get);
router.post("/post", post);
router.put("/put", put);
router.delete("/remove/:id", remove);

module.exports = router;
