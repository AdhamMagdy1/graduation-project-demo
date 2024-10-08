require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const { Op } = require('sequelize');
const path = require('path');
const { sequelize } = require('../config/database');
const {
  Owner,
  Restaurant,
  RestaurantDeliveryAreas,
  Product,
  Extra,
  RestaurantMenu,
  RestaurantWorker,
  Category,
} = require('../models/allModels'); // Import the Restaurant related models
const { AppError } = require('../utils/error'); // Import the custom error class
const Email = require('../utils/email'); // Import the Email class

// Controller function to create a new restaurant Owner
const createOwner = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const existingOwner = await Owner.findOne({ where: { email } });
    if (existingOwner) {
      return next(new AppError('Email is already in use', 400));
    }
    // Create new restaurant Owner with hashed password
    const newOwner = await Owner.create({
      name,
      email,
      password,
    });
    return res.status(201).json({ message: 'Owner created successfully' });
  } catch (error) {
    console.error('Error creating restaurant Owner:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller function for restaurant owner/worker login
const login = async (req, res, next) => {
  const { email, password, accountType } = req.body;

  try {
    let user;
    let isValidPassword;

    if (accountType === 'owner') {
      // Find the owner by email
      user = await Owner.findOne({ where: { email } });
      isValidPassword = await bcrypt.compare(password, user.password);
    } else if (accountType === 'worker') {
      // Find the worker by email
      user = await RestaurantWorker.findOne({ where: { email } });
      isValidPassword = (password === user.password);
    } else {
      return next(new AppError('Invalid account type', 400));
    }

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Verify password
    if (!isValidPassword) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Generate JWT token
    const tokenPayload =
      accountType === 'owner'
        ? { id: user.ownerId, role: 'Owner' }
        : { id: user.workerId, role: 'RestaurantWorker' };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '180h',
    });

    // Send token in response
    return res.status(200).json({ token, accountType });
  } catch (error) {
    console.error('Error logging in:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// controller function to get owner by id
const getOwner = async (req, res, next) => {
  const ownerId = req.user.ownerId; // Extract owner ID from token
  try {
    const owner = await Owner.findByPk(ownerId, {
      attributes: {
        exclude: ['password', 'passwordResetToken', 'passwordResetExpires'],
      },
    });
    if (!owner) {
      return next(new AppError('Owner not found', 404));
    }
    return res.status(200).json(owner);
  } catch (error) {
    console.error('Error getting owner:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller function to edit owner information
const editOwner = async (req, res, next) => {
  const ownerId = req.user.ownerId; // Extract owner ID from token
  const { name, email } = req.body;
  try {
    const owner = await Owner.findByPk(ownerId);
    if (!owner) {
      return next(new AppError('Owner not found', 404));
    }
    owner.name = name || owner.name;
    owner.email = email || owner.email;
    await owner.save();
    return res.status(200).json('owner updated successfully');
  } catch (error) {
    console.error('Error editing owner:', error);
    return next(new AppError('Internal server error', 500));
  }
};

//controller to update password
const ownerUpdatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const ownerId = req.user.ownerId; // Extract owner ID from token
  try {
    const owner = await Owner.findByPk(ownerId);
    if (!owner) {
      return next(new AppError('Owner not found', 404));
    }
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      owner.password
    );
    if (!isPasswordCorrect) {
      return next(new AppError('Invalid current password', 400));
    }
    owner.password = newPassword;
    await owner.save();
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating owner password', error);
    return next(new AppError('Internal server error', 500));
  }
};

// controller to create password reset token
const createPasswordResetToken = async (ownerId) => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  await Owner.update(
    {
      passwordResetToken: passwordResetToken,
      passwordResetExpires: Date.now() + 10 * 60 * 1000 /* 10 minutes */,
    },
    { where: { ownerId } }
  );
  console.log({ resetToken }, passwordResetToken);
  return resetToken;
};

// controller to forgot password
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const owner = await Owner.findOne({ where: { email } });
  try {
    if (!owner) {
      return next(new AppError('User not found', 404));
    }
    const resetToken = await createPasswordResetToken(owner.ownerId);
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/restaurant/owner/resetPasswordPage/?token=${resetToken}`;
    // email service
    await new Email(owner, resetURL).sendPasswordReset();
    return res.status(200).json({ message: 'Token sent to email!' });
  } catch (error) {
    await Owner.update(
      { passwordResetToken: null, passwordResetExpires: null },
      { where: { id: owner.ownerId } }
    );
    console.error('Error sending password reset email:', error);
    return next(new AppError('Internal Server Error', 500));
  }
};

// controller to reset password
const resetPassword = async (req, res, next) => {
  const { newPassword } = req.body;
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');
    const owner = await Owner.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gt]: Date.now() },
      },
    });
    if (!owner) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    owner.password = newPassword;
    owner.passwordResetToken = null;
    owner.passwordResetExpires = null;
    await owner.save();
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return next(new AppError('Internal Server Error', 500));
  }
};

// controller to send reset password page
const serveResetPage = async (req, res) => {
  const filePath = path.join(__dirname, '../utils/reset_password.html');
  res.sendFile(filePath);
};

// Controller function to delete owner
const deleteOwner = async (req, res, next) => {
  const ownerId = req.user.ownerId; // Extract owner ID from token
  const restaurantId = req.user.hasRestaurant;
  try {
    const owner = await Owner.findByPk(ownerId);
    if (!owner) {
      return next(new AppError('Owner not found', 404));
    }
    await sequelize.transaction(async () => {
      await owner.destroy();
      if (restaurantId) {
        await Restaurant.destroy({ where: { restaurantId } });
      }
    });
    return res.status(200).json({
      message: 'Owner deleted successfully along with all his restaurant data',
    });
  } catch (error) {
    console.error('Error deleting owner:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller function to create restaurant information
const createRestaurant = async (req, res, next) => {
  const { name, description, themeColor } = req.body;
  const restaurantDeliveryAreas = JSON.parse(req.body.deliveryAreas);
  const ownerId = req.user.ownerId; // Extract owner ID from token
  const restaurantId = req.user.hasRestaurant;
  try {
    // Check if restaurant already exists
    if (restaurantId) {
      return next(new AppError('Restaurant already exists', 400));
    }
    let logo;
    if (req.file) {
      logo = req.file.buffer.toString('base64');
    }
    // Create new restaurant
    const result = await sequelize.transaction(async () => {
      const newRestaurant = await Restaurant.create({
        name,
        description,
        themeColor,
        logo,
        ownerId,
      });

      // Update owner's hasRestaurant field
      await Owner.update(
        { hasRestaurant: newRestaurant.restaurantId },
        { where: { ownerId } }
      );
      

      const deliveryAreasData = [];

      restaurantDeliveryAreas.forEach(({ city, areas }) => {
        areas.forEach((area) => {
          deliveryAreasData.push({
            city,
            area,
            restaurantId: newRestaurant.restaurantId,
          });
        });
      });

      const deliveryAreas = await RestaurantDeliveryAreas.bulkCreate(deliveryAreasData, { validate: true });

      // Initialize an empty object to hold the organized data
      const organizedData = {};

      // Loop through the array to organize data by city
      deliveryAreas.flat().forEach(({ city, area }) => {
        if (!organizedData[city]) {
          organizedData[city] = [];
        }
        organizedData[city].push(area);
      });

      // Convert the object to an array if needed
      const organizedArray = Object.keys(organizedData).map((city) => ({
        city,
        areas: organizedData[city],
      }));

      // Generate worker data based on restaurant information
      const workerName = `${name}_${newRestaurant.restaurantId}`;
      const workerEmail = `${name.toLowerCase().replace(/\s/g, '')}_${
        newRestaurant.restaurantId
      }@email.com`;
      const workerPassword = `${name}_${newRestaurant.restaurantId}`;

      // Create restaurant worker
      const newWorker = await RestaurantWorker.create({
        name: workerName,
        email: workerEmail,
        password: workerPassword,
        restaurantId: newRestaurant.restaurantId,
      });

      return { restaurant: newRestaurant, worker: newWorker, deliveryAreas: organizedArray };
    });

    const { restaurant, worker, deliveryAreas } = result;

    return res.status(201).json({
      restaurant,
      worker,
      deliveryAreas
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller function to get all restaurants
const getRestaurantById = async (req, res, next) => {
  const { restaurantId } = req.params;
  try {
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }
    return res.status(200).json({restaurant});
  } catch (error) {
    console.error('Error getting restaurants:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// controller to get restaurant delivery areas
const getRestaurantDeliveryAreas = async (req, res, next) => {
  // Extract restaurantId from token
  const restaurantId = req.user.hasRestaurant;
  try {
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }
    const deliveryAreas = await RestaurantDeliveryAreas.findAll({
      where: { restaurantId },
    });
    if (deliveryAreas.length === 0) {
      return next(new AppError('Delivery areas not found', 404));
    }
    // Initialize an empty object to hold the organized data
    const organizedData = {};

    // Loop through the array to organize data by city
    deliveryAreas.flat().forEach(({ city, area }) => {
      if (!organizedData[city]) {
        organizedData[city] = [];
      }
      organizedData[city].push(area);
    });

    // Convert the object to an array if needed
    const organizedArray = Object.keys(organizedData).map((city) => ({
      city,
      areas: organizedData[city],
    }));
    return res.status(200).json({ deliveryAreas: organizedArray });
  } catch (error) {
    console.error('Error getting delivery areas:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller to edit restaurant delivery areas
const editRestaurantDeliveryAreas = async (req, res, next) => {
  // Extract restaurantId from token
  const restaurantId = req.user.hasRestaurant;
  const restaurantDeliveryAreas = req.body.deliveryAreas;
  try {
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }

    const deliveryAreasData = [];

    restaurantDeliveryAreas.forEach(({ city, areas }) => {
      areas.forEach((area) => {
        deliveryAreasData.push({
          city,
          area,
          restaurantId
        });
      });
    });
    const result = await sequelize.transaction(async () => {
      await RestaurantDeliveryAreas.destroy({ where: { restaurantId } });
      const deliveryAreas = await RestaurantDeliveryAreas.bulkCreate(deliveryAreasData, { validate: true });
      return { deliveryAreas };
    });

    const { deliveryAreas } = result;

    // Initialize an empty object to hold the organized data
    const organizedData = {};

    // Loop through the array to organize data by city
    deliveryAreas.flat().forEach(({ city, area }) => {
      if (!organizedData[city]) {
        organizedData[city] = [];
      }
      organizedData[city].push(area);
    });

    // Convert the object to an array if needed
    const organizedArray = Object.keys(organizedData).map((city) => ({
      city,
      areas: organizedData[city],
    }));

    return res.status(200).json({ deliveryAreas: organizedArray });
  } catch (error) {
    console.error('Error editing delivery areas:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller function to get restaurant information
const getRestaurant = async (req, res, next) => {
  // Extract restaurantId from token
  const restaurantId = req.user.hasRestaurant;
  try {
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }
    const restaurant = await Restaurant.findByPk(restaurantId);
    return res.status(200).json({ restaurant });
  } catch (error) {
    console.error('Error getting restaurant:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller function to get all workers
const getRestaurantWorker = async (req, res, next) => {
  const restaurantId = req.user.hasRestaurant;
  try {
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }
    const worker = await RestaurantWorker.findOne({ where: { restaurantId } });
    return res.status(200).json(worker);
  } catch (error) {
    console.error('Error getting workers:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller to update worker information
const updateWorker = async (req, res, next) => {
  // Extract restaurantId from token
  const restaurantId = req.user.hasRestaurant;
  const { name, email } = req.body;
  try {
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }
    const worker = await RestaurantWorker.findOne({
      where: { restaurantId },
      attributes: { exclude: ['password'] },
    });
    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }

    // Update worker information
    worker.name = name || worker.name;
    worker.email = email || worker.email;

    // Save the updated worker
    await worker.save();

    return res.status(200).json(worker);
  } catch (error) {
    console.error('Error updating worker:', error);
    return next(new AppError('Internal server error', 500));
  }
};

const workerUpdatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  // Extract restaurantId from token
  const restaurantId = req.user.hasRestaurant;
  try {
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }
    const worker = await RestaurantWorker.findOne({ where: { restaurantId } });
    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }
    const isPasswordCorrect = (currentPassword === worker.password);
    if (!isPasswordCorrect) {
      return next(new AppError('Invalid current password', 400));
    }
    worker.password = newPassword;
    await worker.save();
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating worker password', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller function to edit restaurant information by ID
const editRestaurant = async (req, res, next) => {
  // Extract restaurantId from token
  const restaurantId = req.user.hasRestaurant;
  const { name, description, themeColor } = req.body;
  try {
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }
    const restaurant = await Restaurant.findByPk(restaurantId);
    // Update restaurant details
    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    // restaurant.subscription = subscription || restaurant.subscription; // Convert subscription string to Date object
    restaurant.themeColor = themeColor || restaurant.themeColor;
    if (req.file) {
      restaurant.logo = req.file.buffer.toString('base64');
    }
    await restaurant.save();
    return res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error editing restaurant:', error);
    return next(new AppError('Internal server error', 500));
  }
};

const deleteOwnerRestaurant = async (req, res, next) => {
  const ownerId = req.user.ownerId; // Extract owner ID from token
  const restaurantId = req.user.hasRestaurant;
  try {
    if (!restaurantId) {
      return next(new AppError('No restaurant found for the owner', 404));
    }
    await sequelize.transaction(async () => {
      await Restaurant.destroy({ where: { restaurantId } });
      await Owner.update({ hasRestaurant: null }, { where: { ownerId } });
    });
    return res
      .status(200)
      .json({ message: 'Restaurant deleted successfully with its data' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Create a new product
const createProduct = async (req, res, next) => {
  const productData = req.body.product;
  // Extract restaurantId from token
  const restaurantId = req.user.hasRestaurant;
  try {
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }
    const { name, ingredient, size, categoryId } = productData;
    // Create product with associated restaurantId
    const newProduct = await Product.create({
      name,
      ingredient,
      size,
      categoryId,
      restaurantId,
    });
    res
      .status(201)
      .json({ message: 'Products created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating products:', error);
    next(new AppError('Internal server error', 500));
  }
};

// Get all products
const getAllProducts = async (req, res, next) => {
  const ownerId = req.user.ownerId; // Extract ownerId from token
  const restaurantId = req.user.hasRestaurant;
  try {
    // const restaurant = await Restaurant.findOne({ where: { ownerId } });
    // const restaurantId = restaurant.restaurantId;
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }
    const products = await Product.findAll({ where: { restaurantId } });
    if (products.length === 0) {
      return next(new AppError('Products not found', 404));
    }
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Get all products in a category
const getAllCategoryProducts = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.findAll({ where: { categoryId } });
    if (products.length === 0) {
      return next(new AppError('Products not found', 404));
    }
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Get product by ID
const getProductById = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Edit product by ID
const editProductById = async (req, res, next) => {
  const { productId } = req.params;
  const { name, ingredient, size } = req.body;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    product.name = name || product.name;
    product.ingredient = ingredient || product.ingredient;
    product.size = size || product.size;
    await product.save();
    return res.status(201).json(product);
  } catch (error) {
    console.error('Error editing product:', error);
    return next(new AppError('Internal server error', 500));
  }
};

const deleteProductById = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    await product.destroy();
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Create a new extra
const createExtra = async (req, res, next) => {
  const ownerId = req.user.ownerId; // Extract ownerId from token
  const restaurantId = req.user.hasRestaurant;
  const { name, price } = req.body;
  try {
    // const restaurant = await Restaurant.findOne({ where: { ownerId } });
    // const restaurantId = restaurant.restaurantId;
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }
    const newExtra = await Extra.create({ name, price, restaurantId });
    res
      .status(201)
      .json({ message: 'Extra created successfully', extra: newExtra });
  } catch (error) {
    console.error('Error creating extra:', error);
    next(new AppError('Internal server error', 500));
  }
};

// Get all extras for a restaurant
const getAllExtras = async (req, res, next) => {
  const ownerId = req.user.ownerId; // Extract ownerId from token
  const restaurantId = req.user.hasRestaurant;
  try {
    // const restaurant = await Restaurant.findOne({ where: { ownerId } });
    // const restaurantId = restaurant.restaurantId;
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }
    const extras = await Extra.findAll({ where: { restaurantId } });
    if (extras.length === 0) {
      return next(new AppError('Extras not found', 404));
    }
    return res.status(200).json(extras);
  } catch (error) {
    console.error('Error getting extras:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Get extra by ID
const getExtraById = async (req, res, next) => {
  const { extraId } = req.params;
  try {
    const extra = await Extra.findByPk(extraId);
    if (!extra) {
      return next(new AppError('Extra not found', 404));
    }
    return res.status(200).json(extra);
  } catch (error) {
    console.error('Error getting extra:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Edit extra by ID
const editExtraById = async (req, res, next) => {
  const { extraId } = req.params;
  const { name, price } = req.body;
  try {
    const extra = await Extra.findByPk(extraId);
    if (!extra) {
      return next(new AppError('Extra not found', 404));
    }
    extra.name = name || extra.name;
    extra.price = price || extra.price;
    await extra.save();
    return res.status(200).json(extra);
  } catch (error) {
    console.error('Error editing extra;', error);
    return next(new AppError('Inrenal server error', 500));
  }
};

// Delete extra by ID
const deleteExtraById = async (req, res, next) => {
  const { extraId } = req.params;

  try {
    const extra = await Extra.findByPk(extraId);
    if (!extra) {
      return next(new AppError('Extra not found', 404));
    }
    await extra.destroy();
    return res.status(200).json({ message: 'Extra deleted successfully' });
  } catch (error) {
    console.error('Error deleting extra:', error);
    return next(new AppError('Internal server error', 500));
  }
};

//controlller to handle menu upload
const uploadMenu = async (req, res, next) => {
  // Extract restaurantId from token
  const restaurantId = req.user.hasRestaurant;
  try {
    // Extract data from form-data
    const { description } = req.body;
    const menuImages = req.files.map((file) => file.buffer.toString('base64'));
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }

    // Save each menu image to the database
    const menuEntriesData = menuImages.map((menuImage) => ({
      description,
      menuImage,
      restaurantId
    }));

    const menuEntries = await RestaurantMenu.bulkCreate(menuEntriesData, { validate: true });

    // Send response
    res.status(201).json({ success: true, menu: menuEntries });
  } catch (error) {
    next(error);
  }
};

// controller to get menu
const getMenu = async (req, res, next) => {
  // Extract restaurantId from token
  const restaurantId = req.user.hasRestaurant;
  try {
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }
    const menu = await RestaurantMenu.findAll({ where: { restaurantId } });
    if (menu.length === 0) {
      return next(new AppError('Menu not found', 404));
    }
    return res.status(200).send(menu);
  } catch (error) {
    console.error('Error getting menu:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller to edit menu
const editMenu = async (req, res, next) => {
  const { menuId } = req.params;
  const { description } = req.body;
  try {
    const menu = await RestaurantMenu.findByPk(menuId);
    if (!menu) {
      return next(new AppError('Menu not found', 404));
    }
    menu.description = description || menu.description;
    if (req.file) {
      menu.menuImage = req.file.buffer.toString('base64');
    }
    await menu.save();
    return res.status(200).json(menu);
  } catch (error) {
    console.error('Error editing menu:', error);
    return next(new AppError('Internal server error', 500));
  }
};

const deleteMenu = async (req, res, next) => {
  const { menuId } = req.params;
  try {
    const menu = await RestaurantMenu.findByPk(menuId);
    if (!menu) {
      return next(new AppError('Menu not found', 404));
    }
    await menu.destroy();
    return res.status(200).json({ message: 'Menu deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller to create a new category
const createCategory = async (req, res, next) => {
  const { name } = req.body;
  // Extract restaurantId from token
  const restaurantId = req.user.hasRestaurant;
  try {
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }
    const newCategory = await Category.create({
      name,
      restaurantId,
    });
    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    next(new AppError('Internal server error', 500));
  }
};

// Controllet to edit exiting category
const editCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  try {
    const updatedCategory = await Category.findByPk(categoryId);
    if (!updatedCategory) {
      return next(new AppError('Category not found for the owner', 404));
    }
    updatedCategory.name = name;
    updatedCategory.save();
    res.status(200).json({
      message: 'Category updated successfully',
      updatedCategory: updatedCategory,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    next(new AppError('Internal server error', 500));
  }
};

// Controller to get all the categories of a resturant
const getRestaurantCategories = async (req, res, next) => {
  // Extract restaurantId from token
  const restaurantId = req.user.hasRestaurant;
  try {
    if (!restaurantId) {
      return next(new AppError('Restaurant not found', 404));
    }
    const categories = await Category.findAll({ where: { restaurantId } });
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories by restaurant ID:', error);
    next(new AppError('Internal server error', 500));
  }
};
// Controller to delete a category
const deleteCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return next(new AppError('Category not found for the owner', 404));
    }
    await Category.destroy({ where: { categoryId } });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    next(new AppError('Internal server error', 500));
  }
};

module.exports = {
  createOwner,
  login,
  getOwner,
  editOwner,
  deleteOwner,
  createRestaurant,
  getRestaurantById,
  getRestaurant,
  editRestaurant,
  createProduct,
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
  getRestaurantWorker,
  updateWorker,
  deleteOwnerRestaurant,
  createCategory,
  editCategory,
  deleteCategory,
  getRestaurantCategories,
  getRestaurantDeliveryAreas,
  getAllCategoryProducts,
  editRestaurantDeliveryAreas,
  ownerUpdatePassword,
  forgotPassword,
  resetPassword,
  workerUpdatePassword,
  deleteMenu,
  serveResetPage,
};
