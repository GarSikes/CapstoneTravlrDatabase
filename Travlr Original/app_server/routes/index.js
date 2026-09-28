// app_server/routes/index.js
var express = require('express');
var router = express.Router();

var mainController = require('../controllers/main');
var travelController = require('../controllers/travel');

/* GET home page. */
router.get('/', mainController.index);

/* GET travel page. */
router.get('/travel', travelController.travel);

module.exports = router;
