const express = require('express');
const router = express.Router();
const { getApod, postApodSummary } = require('../controllers/apodController');

router.get('/', getApod);
router.post('/summary', postApodSummary);

module.exports = router;
