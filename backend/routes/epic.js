const express = require('express');
const router = express.Router();
const { getEpicImages } = require('../controllers/epicController');

router.get('/', getEpicImages);

module.exports = router;
