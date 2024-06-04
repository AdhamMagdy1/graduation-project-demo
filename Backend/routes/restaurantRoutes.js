const express = require("express");
const router = express.Router();
const multer = require("multer");

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
  editRestaurantDeliveryAreas,
  forgotPassword,
  resetPassword,
  ownerUpdatePassword,
  workerUpdatePassword,
} = require("../controllers/restaurantController");
const { Owner } = require("../models/allModels");
const {
  authenticateUser,
  autherizeUser,
} = require("../middleware/authenticateUser");

// Owner routes
router.post("/create", createOwner);
router.post("/login", login);
router.get(
  "/owner/",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  getOwner
);
router.put(
  "/owner/",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  editOwner
);
router.delete(
  "/owner/account",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  deleteOwner
);
router.patch(
  "/owner/changePassword",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  ownerUpdatePassword
);
router.post("/owner/forgotPassword", forgotPassword);
router.patch("/owner/resetPassword/:resetToken", resetPassword);

// Resturant routes
router.post(
  "/setup",
  upload.single("logo"),
  authenticateUser(Owner),
  autherizeUser("Owner"),
  createRestaurant
);
router.get(
  "/all",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  getAllRestaurants
);
router.get(
  "/info",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  getRestaurant
);
router.get(
  "/workers",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  getAllWorkers
);
router.patch(
  "/worker/password",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  workerUpdatePassword
);
router.put(
  "/worker",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  updateWorker
);
router.put(
  "/edit",
  upload.single("logo"),
  authenticateUser(Owner),
  autherizeUser("Owner"),
  editRestaurant
);
router.delete(
  "/delete",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  deleteOwnerRestaurant
);

// products
router.post(
  "/product",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  createProduct
);
router.get(
  "/products/all",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  getAllProducts
);
router.get(
  "/products/category/:categoryId",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  getAllCategoryProducts
);
router.get(
  "/products/:productId",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  getProductById
);
router.put(
  "/products/:productId",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  editProductById
);
router.delete(
  "/products/:productId",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  deleteProductById
);

// extras
router.post(
  "/extras",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  createExtra
);
router.get(
  "/extras/all",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  getAllExtras
);
router.get(
  "/extras/:extraId",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  getExtraById
);
router.put(
  "/extras/:extraId",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  editExtraById
);
router.delete(
  "/extras/:extraId",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  deleteExtraById
);

// Menu routes
router.post(
  "/menu/upload",
  upload.array("menuImage"),
  authenticateUser(Owner),
  autherizeUser("Owner"),
  uploadMenu
);
router.get(
  "/menu/get",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  getMenu
);
router.put(
  "/menu/:menuId",
  upload.single("menuImage"),
  authenticateUser(Owner),
  autherizeUser("Owner"),
  editMenu
);

// Delivery Areas routes
router.get(
  "/deliveryAreas",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  getRestaurantDeliveryAreas
);
router.put(
  "/editDeliveryAreas",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  editRestaurantDeliveryAreas
);

// Category routes
router.post(
  "/category",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  createCategory
);
router.get(
  "/category/all",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  getRestaurantCategories
);
router.put(
  "/category/:id",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  editCategory
);
router.delete(
  "/category/:id",
  authenticateUser(Owner),
  autherizeUser("Owner"),
  deleteCategory
);

module.exports = router;
