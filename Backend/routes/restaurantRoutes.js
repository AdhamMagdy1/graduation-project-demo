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
} = require('../controllers/restaurantController');
const authenticateUser = require('../middleware/authenticateUser');
// Route to create a new restaurant Owner
router.post('/create', createOwner);
// Route to create a new restaurant Owner
router.post('/login', loginOwner);
router.get('/owner/:ownerId', getOwnerById); // working
router.put('/owner/:ownerId', editOwner); // working
router.delete('/owner/:ownerId', deleteOwner); // final one will not check it until create another owner

// Apply authentication middleware to resturant info routes
router.post('/setup', authenticateUser, createRestaurant);
router.get('/all', getAllRestaurants);
router.get('/:restaurantId', authenticateUser, getRestaurantById);
router.put('/:restaurantId', authenticateUser,  editRestaurantById);
router.delete('/:restaurantId', authenticateUser, deleteRestaurantById);

// products
router.post('/products', authenticateUser, createProducts);
router.post('/extras', authenticateUser, createExtra);
router.post('/products/:ProductProductId/extras', authenticateUser, associateExtrasWithProduct);
router.get('/products/productExtras', authenticateUser, getAllProductExtras);
router.get('/products/all', authenticateUser, getAllProducts);
router.get('/products/:productId', authenticateUser, getProductById);
router.put('/products/:productId', authenticateUser, editProductById);
router.delete('/products/:productId', authenticateUser, deleteProductById);

// extras
router.get('/extras/all', getAllExtras);
router.get('/extras/:extraId', getExtraById);
router.put('/extras/:extraId', editExtraById);
router.delete('/extras/:extraId', deleteExtraById);


router.get('/products/:ProductProductId/extras', authenticateUser, getAssociatedExtrasForProduct);
router.put('/products/:ProductProductId/extras/:ExtraExtraId', authenticateUser, editProductExtra);
router.delete('/products/:ProductProductId/extras/', authenticateUser, deleteProductExtras);

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
router.put('/menu/:menuId', upload.single('menuImage'), authenticateUser, editMenu);
router.delete('/menu/:menuId', authenticateUser, deleteMenu);
module.exports = router;
