const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/authMiddleware');
const customerController = require('../controllers/customerAuth');



router.post('/login', customerController.login);

module.exports = router;