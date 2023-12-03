import express from 'express';

const { Router } = express;

const router = Router();

// Creating the route
router.get('/author', (req, res) => {
  // Responding to the client using res object
  res.json({
    name: 'aylen & berenice',
    lastname: 'espinoza & perez',
  });
}); // function(req, res){}

// Exporting the router
export default router;
