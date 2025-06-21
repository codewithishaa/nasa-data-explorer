const express = require("express");
const router = express.Router();
const { fetchImageLibrary } = require("../controllers/imageController");

router.get("/", fetchImageLibrary);

module.exports = router;
