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
  getOwner,
  deleteOwnerRestaurant,
  createRestaurant,
  getAllRestaurants,
  getRestaurant,
  editRestaurant,
  getAllProducts,
  getProductById,
  editProductById,
  deleteProductById,
  createExtra,
  getAllExtras,
  getExtraById,
  editExtraById,
  deleteExtraById,
  // associateExtrasWithProduct,
  // getAssociatedExtrasForProduct,
  getAllProductExtras,
  editProductExtra,
  deleteProductExtras,
  uploadMenu,
  getMenu,
  editMenu,
  getAllWorkers,
  updateWorker,
  createProduct,
  getRestaurantDeliveryAreas,
  createCategory,
  editCategory,
  deleteCategory,
  getRestaurantCategories,
  getAllCategoryProducts,
  // deleteRestaurantDeliveryAreas, // no routes for this
  forgotPassword,
  resetPassword,
  ownerUpdatePassword,
} = require('../controllers/restaurantController');
const authenticateUser = require('../middleware/authenticateUser');

// Route to create a new restaurant Owner
router.post('/create', createOwner);
router.post('/login', login);
router.get('/owner/', authenticateUser, getOwner);
router.put('/owner/', authenticateUser, editOwner);
router.delete('/owner/account', authenticateUser, deleteOwner);
router.patch('/owner/changePassword', authenticateUser, ownerUpdatePassword);
router.post('/owner/forgotPassword', forgotPassword);
router.patch('/owner/resetPassword/:resetToken', resetPassword);

// Apply authentication middleware to resturant info routes
router.post(
  '/setup',
  upload.single('logo'),
  authenticateUser,
  createRestaurant
);
router.get('/all', authenticateUser, getAllRestaurants);
router.get('/info', authenticateUser, getRestaurant);
router.get('/workers', authenticateUser, getAllWorkers);
router.put('/worker', authenticateUser, updateWorker);
router.put(
  '/edit',
  upload.single('logo'),
  authenticateUser,
  editRestaurant
);
router.delete('/delete', authenticateUser, deleteOwnerRestaurant);

router.get('/products/productExtras', authenticateUser, getAllProductExtras);
// products
router.post('/product', authenticateUser, createProduct);
router.get('/products/all', authenticateUser, getAllProducts);
router.get('/products/category/:categoryId', authenticateUser, getAllCategoryProducts);
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
// router.post(
//   '/products/:productId/extras',
//   authenticateUser,
//   associateExtrasWithProduct
// );
// router.get(
//   '/products/:productId/extras',
//   authenticateUser,
//   getAssociatedExtrasForProduct
// );
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

// Delivery Areas
router.get('/deliveryAreas', authenticateUser, getRestaurantDeliveryAreas);

// Category routes
router.post('/category', authenticateUser, createCategory);
router.get('/category/all', authenticateUser, getRestaurantCategories);
router.put('/category/:id', authenticateUser, editCategory);
router.delete('/category/:id', authenticateUser, deleteCategory);
module.exports = router;
