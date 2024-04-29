const express = require('express');
const router = express.Router();
const multer = require('multer');

//Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  createOwner,
  login,
  editOwner,
  deleteOwner,
  getOwnerById,
  deleteOwnerRestaurant,
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  editRestaurantById,
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
  getAllWorkers,
  updateWorker,
} = require('../controllers/restaurantController');
const authenticateUser = require('../middleware/authenticateUser');

// Route to create a new restaurant Owner
router.post('/create', createOwner);
router.post('/login', login);
router.get('/owner/', authenticateUser, getOwnerById);
router.put('/owner/', authenticateUser, editOwner);
router.delete('/owner/account', authenticateUser, deleteOwner);

// Apply authentication middleware to resturant info routes
router.post('/setup', upload.single('logo'), authenticateUser, createRestaurant);
router.get('/all', authenticateUser, getAllRestaurants);
router.get('/info', authenticateUser, getRestaurantById);
router.get('/workers', authenticateUser, getAllWorkers);
router.put('/worker', authenticateUser, updateWorker);
router.put('/edit', upload.single('logo'), authenticateUser, editRestaurantById); 
router.delete('/delete', authenticateUser, deleteOwnerRestaurant);

router.get('/products/productExtras', authenticateUser, getAllProductExtras);
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
  '/products/:productId/extras',
  authenticateUser,
  associateExtrasWithProduct
);
router.get(
  '/products/:productId/extras',
  authenticateUser,
  getAssociatedExtrasForProduct
);
router.put(
  '/products/:productId/extras/:extraId',
  authenticateUser,
  editProductExtra
);
router.delete(
  '/products/:productId/extras/',
  authenticateUser,
  deleteProductExtras
);

//route to upload menu
router.post(
  '/menu/upload',
  upload.single('menuImage'),
  authenticateUser,
  uploadMenu
);
//route to get menus
router.get('/menu/get', authenticateUser, getMenu);
//route to edit menu
router.put(
  '/menu/:menuId',
  upload.single('menuImage'),
  authenticateUser,
  editMenu
);

module.exports = router;
