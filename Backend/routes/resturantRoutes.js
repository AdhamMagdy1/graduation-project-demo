const express = require('express');
const router = express.Router();
const { createRestaurantWorker } = require('../controllers/resturantController');

// Route to create a new restaurant worker
router.post('/create', createRestaurantWorker);


module.exports = router;
