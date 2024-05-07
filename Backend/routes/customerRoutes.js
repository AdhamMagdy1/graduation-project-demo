const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/authMiddleware');
const customerController = require('../controllers/customerController');
const authenticateUser = require('../middleware/authenticateUser');



router.post('/login', customerController.login);
router.post('/watingOrder', authenticateUser, customerController.createWaitingOrder);
router.post('/createOrder', authenticateUser, customerController.createOrder);
router.post('/createAddress', authenticateUser, customerController.createAddress);
router.post('/createPhoneNumber', authenticateUser, customerController.createCustomerPhoneNumber);
router.get('/all', customerController.getAllCustomers);
router.get('/allOrders', customerController.getAllOrders);
router.put('/editOrderStatus', authenticateUser, customerController.editOrderStatus);


module.exports = router;