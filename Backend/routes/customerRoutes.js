const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/authMiddleware');
const customerController = require('../controllers/customerAuth');
const authenticateUser = require('../middleware/authenticateUser');



router.post('/login', customerController.login);
router.post('/watingOrder'/*, authenticateUser*/, customerController.createWaitingOrder);
router.post('/createOrder'/*, authenticateUser*/, customerController.createOrder);
router.post('/createAddress'/*, authenticateUser*/, customerController.createAddress);
router.post('/createPhoneNumber'/*, authenticateUser*/, customerController.createCustomerPhoneNumber);
router.get('/all', customerController.getAllCustomers);


module.exports = router;