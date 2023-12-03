const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'ITGAM', author: 'espinoza aylen & perez berenice' });
});

// Pripio

module.exports = router;