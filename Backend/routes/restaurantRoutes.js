const express = require('express');
const router = express.Router();
const {
  createOwner,
  loginOwner,
} = require('../controllers/restaurantController');

// Route to create a new restaurant Owner
router.post('/create', createOwner);
// Route to create a new restaurant Owner
router.post('/login', loginOwner);

module.exports = router;
