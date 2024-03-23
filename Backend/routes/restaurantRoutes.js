const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createOwner,
  loginOwner,
  editOwner,
  deleteOwner,
  getOwnerById,
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  editRestaurantById,
  deleteRestaurantById,
  createProducts,
  getAllProducts,
  getProductById,
  editProductById,
  deleteProductById,
  createExtra,
  getAllExtras,
  getExtraById,
  editExtraById,
  deleteExtraById,
  associateExtrasWithProduct,
  getAssociatedExtrasForProduct,
  getAllProductExtras,
  editProductExtra,
  deleteProductExtras,
  uploadMenu,
  getMenu,
  editMenu,
  deleteMenu,
  getAllWorkers,
  updateWorker,
} = require('../controllers/restaurantController');
const authenticateUser = require('../middleware/authenticateUser');

// Route to create a new restaurant Owner
router.post('/create', createOwner);
router.post('/login', loginOwner);
router.get('/owner/', authenticateUser, getOwnerById); // working
router.put('/owner/', authenticateUser, editOwner); // working
router.delete('/owner/', authenticateUser, deleteOwner); // final one will not check it until create another owner

// Apply authentication middleware to resturant info routes
router.post('/setup', authenticateUser, createRestaurant);
router.get('/all', authenticateUser, getAllRestaurants);
router.get('/info', authenticateUser, getRestaurantById);
router.get('/workers', authenticateUser, getAllWorkers);
router.put('/worker', authenticateUser, updateWorker);
router.put('/:restaurantId', authenticateUser, editRestaurantById);
router.delete('/:restaurantId', authenticateUser, deleteRestaurantById);

// products
router.post('/products', authenticateUser, createProducts);
router.get('/products/all', authenticateUser, getAllProducts);
router.get('/products/:productId', authenticateUser, getProductById);
router.put('/products/:productId', authenticateUser, editProductById);
router.delete('/products/:productId', authenticateUser, deleteProductById);

// extras
router.post('/extras', authenticateUser, createExtra);
router.get('/extras/all', authenticateUser, getAllExtras);
router.get('/extras/:extraId', authenticateUser, getExtraById);
router.put('/extras/:extraId', authenticateUser, editExtraById);
router.delete('/extras/:extraId', authenticateUser, deleteExtraById);

//productsExstras
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
router.get('/products/productExtras', authenticateUser, getAllProductExtras);
router.put(
  '/products/:ProductProductId/extras/:ExtraExtraId',
  authenticateUser,
  editProductExtra
);
router.delete(
  '/products/:ProductProductId/extras/',
  authenticateUser,
  deleteProductExtras
);

//Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });
//route to upload menu
router.post(
  '/menu/upload',
  upload.single('menuImage'),
  authenticateUser,
  uploadMenu
);
router.get('/menu/:menuId', authenticateUser, getMenu);
router.put(
  '/menu/:menuId',
  upload.single('menuImage'),
  authenticateUser,
  editMenu
);
router.delete('/menu/:menuId', authenticateUser, deleteMenu);

module.exports = router;
