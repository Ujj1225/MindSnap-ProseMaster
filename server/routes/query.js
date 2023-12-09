const express = require("express");
const { query } = require("../controller/query");
const router = express.Router();
router.route("/").post(query);
module.exports = router;
