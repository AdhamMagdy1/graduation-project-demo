const express = require('express');
const router = express.Router();
const { createOwner } = require('../controllers/resturantController');

// Route to create a new restaurant Owner
router.post('/create', createOwner);


module.exports = router;
