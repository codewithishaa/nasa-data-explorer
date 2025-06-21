const express = require("express");
const router = express.Router();
const { fetchMarsPhotos } = require("../controllers/marsController");

router.get("/", fetchMarsPhotos);

module.exports = router;
