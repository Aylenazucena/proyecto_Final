var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'biblioteca', author:"Espinoza aylen & perez berenice"});
});

// Pripio

module.exports = router;