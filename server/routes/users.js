const express = require('express');

const router = express.Router();

// GET /users
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

// GET /users/author
router.get('/author', (_, res) => {
  res.render('author', { author: 'espinoza aylen & perez berenice ' });
});

module.exports = router;