const express = require('express');
const router = express.Router();
const { getNeoData } = require('../controllers/neoController');

router.get('/', getNeoData);

module.exports = router;
