const express = require('express');
const router = express.Router();
const {
  createOwner,
  loginOwner,
  createRestaurant,
  getRestaurantById,
  editRestaurantById,
  createProducts,
  createExtra,
  associateExtrasWithProduct,
  getAssociatedExtrasForProduct,
  getAllProductExtras,
} = require('../controllers/restaurantController');
const authenticateUser = require('../middleware/authenticateUser');
// Route to create a new restaurant Owner
router.post('/create', createOwner);
// Route to create a new restaurant Owner
router.post('/login', loginOwner);

// Apply authentication middleware to resturant info routes
router.post('/setup', authenticateUser, createRestaurant);
router.get('/:restaurantId', authenticateUser, getRestaurantById);
router.put('/:restaurantId', authenticateUser, editRestaurantById);
//create products and extras
router.post('/products', authenticateUser, createProducts);
router.post('/extras', authenticateUser, createExtra);
router.post(
  '/products/:ProductProductId/extras',
  authenticateUser,
  associateExtrasWithProduct
);
router.get(
  '/products/:ProductProductId/extras',
  authenticateUser,
  getAssociatedExtrasForProduct
);
router.get('/products/productExtras', getAllProductExtras);

module.exports = router;
