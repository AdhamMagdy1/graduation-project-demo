const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/authMiddleware');
const customerController = require('../controllers/customerController');
const authenticateUser = require('../middleware/authenticateUser');


router.post('/login', customerController.login);
router.post('/createAddress', authenticateUser, customerController.createAddress);
router.get('/all', customerController.getAllCustomers);
router.get('/allOrders', customerController.getAllOrders);
router.get('/allPhoneNumbers',  customerController.getAllCustomersPhoneNumber);
router.delete('/order/all', customerController.deleteAllOrders);

module.exports = router;