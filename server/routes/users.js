import express from 'express';

const { Router } = express;

const router = Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

export default router;
