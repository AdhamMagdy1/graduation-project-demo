require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { Op } = require('sequelize');
const {
  Owner,
  Restaurant,
  RestaurantDeliveryAreas,
  ProductIngredient,
  Product,
  Extra,
  ProductExtra,
  RestaurantMenu,
  RestaurantWorker,
  Category,
} = require('../models/allModels'); // Import the Restaurant related models
const { AppError } = require('../utils/error'); // Import the custom error class

// Controller function to create a new restaurant Owner
const createOwner = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const existingOwner = await Owner.findOne({ where: { email } });
    if (existingOwner) {
      return next(new AppError('Email is already in use', 400));
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new restaurant Owner with hashed password
    const newOwner = await Owner.create({
      name,
      email,
      password: hashedPassword,
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

    if (accountType === 'owner') {
      // Find the owner by email
      user = await Owner.findOne({ where: { email } });
    } else if (accountType === 'worker') {
      // Find the worker by email
      user = await RestaurantWorker.findOne({ where: { email } });
    } else {
      return next(new AppError('Invalid account type', 400));
    }

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Generate JWT token
    const tokenPayload =
      accountType === 'owner' ? { id: user.ownerId } : { id: user.workerId };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '180h',
    });

    // Send token in response
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// controller function to get owner by id
const getOwner = async (req, res, next) => {
  const ownerId = req.user.id; // Extract owner ID from token
  try {
    const owner = await Owner.findByPk(ownerId, {
      attributes: { exclude: ['password'] },
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
  const ownerId = req.user.id; // Extract owner ID from token
  const { name, email, password } = req.body;
  try {
    const owner = await Owner.findByPk(ownerId);
    if (!owner) {
      return next(new AppError('Owner not found', 404));
    }
    owner.name = name || owner.name;
    owner.email = email || owner.email;
    await owner.save();
    return res.status(200).json("owner updated successfully");
  } catch (error) {
    console.error('Error editing owner:', error);
    return next(new AppError('Internal server error', 500));
  }
};

//controller to update password
// const ownerUpdatePassword = async (req, res, next) => {
//   const { currentPassword, newPassword } = req.body;
//   const ownerId = req.user.id; // Extract owner ID from token
//   try {
//     const owner = await Owner.findByPk(ownerId);
//     if (!owner) {
//       return next(new AppError('Owner not found', 404));
//     }
//     const isPasswordCorrect = await bcrypt.compare(currentPassword, owner.password);
//     if (!isPasswordCorrect) {
//       return next(new AppError('Invalid current password', 400));
//     }
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     owner.password = hashedPassword;
//     await owner.save();
//     return res.status(200).json({ message: 'Password updated successfully' });
//   } catch (error) {
//     console.error('Error updating owner password', error);
//     return next(new AppError('Internal server error', 500));
//   }
// }

// Controller function to delete owner
const deleteOwner = async (req, res, next) => {
  const ownerId = req.user.id; // Extract owner ID from token
  try {
    const owner = await Owner.findByPk(ownerId);
    if (!owner) {
      return next(new AppError('Owner not found', 404));
    }
    await owner.destroy();
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
  const { name, description, subscription, themeColor } = req.body;
  const logo = req.file.buffer.toString('base64');
  const restaurantDeliveryAreas = JSON.parse(req.body.deliveryAreas);
  const ownerId = req.user.id; // Extract owner ID from token

  try {
    // Create new restaurant
    const newRestaurant = await Restaurant.create({
      name,
      description,
      subscription: new Date(subscription),
      themeColor,
      logo,
      ownerId,
    });
    
    const restaurantId = newRestaurant.restaurantId;
    // check docs for create function to see how to get the restaurant id and save function wether the id will be placed after the create function or after the save function
    const restaurant = await Restaurant.findByPk(restaurantId);
    restaurant.link = `/restaurant${restaurantId}`;
    await restaurant.save();

    // Update owner's hasRestaurant field
    await Owner.update({ hasRestaurant: true }, { where: { ownerId } });
    // Create delivery areas for the restaurant
    const deliveryAreas = await Promise.all(restaurantDeliveryAreas.map(async (deliveryArea) => {
      const { city, area } = deliveryArea;
      const createdDeliveryArea = await RestaurantDeliveryAreas.create({
        city,
        area,
        restaurantId,
      });
      return createdDeliveryArea
    }));

    // Generate worker data based on restaurant information
    const workerName = `${name}_${restaurantId}`;
    const workerEmail = `${name.toLowerCase().replace(/\s/g, '')}_${
      newRestaurant.restaurantId
    }@email.com`;
    const workerPassword = `${name}_${restaurantId}`;

    // Hash the password
    const hashedPassword = await bcrypt.hash(workerPassword, 10);

    // Create restaurant worker
    const newWorker = await RestaurantWorker.create({
      name: workerName,
      email: workerEmail,
      password: hashedPassword,
      restaurantId: restaurantId,
    });
    return res
      .status(201)
      .json({ restaurant: restaurant, worker: newWorker, deliveryAreas: deliveryAreas});
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller function to get all restaurants
const getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.findAll();
    if (restaurants.length === 0) {
      return next(new AppError('Restaurants not found', 404));
    }
    return res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error getting restaurants:', error);
    return next(new AppError('Internal server error', 500));
  }
};

const getRestaurantDeliveryAreas = async (req, res, next) => {
  const ownerId = req.user.id; // Extract owner ID from token
  try {
    const restaurant = await Restaurant.findOne({ where: { ownerId } });
    const restaurantId = restaurant.restaurantId;
    const deliveryAreas = await RestaurantDeliveryAreas.findAll({ where: { restaurantId } });
    if (deliveryAreas.length === 0) {
      return next(new AppError('Delivery areas not found', 404));
    }
    return res.status(200).json(deliveryAreas);
  } catch (error) {
    console.error('Error getting delivery areas:', error);
    return next(new AppError('Internal server error', 500));
  }
};

const deleteRestaurantDeliveryAreas = async (req, res, next) => {
  const ownerId = req.user.id; // Extract owner ID from token
  const { deliveryAreasId } = req.body;
  try {
    const restaurant = await Restaurant.findOne({ where: { ownerId } });
    const restaurantId = restaurant.restaurantId;
    await RestaurantDeliveryAreas.destroy({ where: { deliveryAreasId, restaurantId } });
    return res.status(200).json({ message: 'Delivery areas deleted successfully' });
  } catch (error) {
    console.error('Error deleting delivery areas:', error);
    return next(new AppError('Internal server error', 500));
  }
};


// Controller function to get restaurant information by ID
const getRestaurant = async (req, res, next) => {
  const ownerId = req.user.id; // Extract owner ID from token

  try {
    // Find restaurant by ID
    const restaurant = await Restaurant.findOne({attributes: { exclude: ['logo'] }}, { where: { ownerId } });
    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }

    const restaurantId = restaurant.restaurantId;
    // Find workers related to the restaurant
    const workers = await RestaurantWorker.findOne({ where: { restaurantId } });

    return res.status(200).json({ restaurant, workers });
  } catch (error) {
    console.error('Error getting restaurant:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller function to get all workers
const getAllWorkers = async (req, res, next) => {
  try {
    // Find all workers
    const workers = await RestaurantWorker.findAll();
    if (workers.length === 0) {
      return next(new AppError('Workers not found', 404));
    }
    return res.status(200).json(workers);
  } catch (error) {
    console.error('Error getting workers:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller to update worker information
const updateWorker = async (req, res, next) => {
  const ownerId = req.user.id; // Extract owner ID from token
  const { name, email, password } = req.body;

  try {
    // Find the worker by ID
    const restaurant = await Restaurant.findOne({ where: { ownerId } });
    const restaurantId = restaurant.restaurantId;
    const worker = await RestaurantWorker.findOne({ where: { restaurantId } });
    // Hash the password
    if (!worker) {
      return next(new AppError('Worker not found', 404));
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update worker information
    worker.name = name;
    worker.email = email;
    worker.password = hashedPassword;

    // Save the updated worker
    await worker.save();

    return res.status(200).json(worker);
  } catch (error) {
    console.error('Error updating worker:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller function to edit restaurant information by ID
const editRestaurant = async (req, res, next) => {
  const ownerId = req.user.id; // Extract owner ID from token
  const { name, description, subscription, themeColor } = req.body;
  try {
    // Find restaurant by ID
    const restaurant = await Restaurant.findOne({ where: { ownerId } });
    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }
    // Update restaurant details
    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.subscription = subscription || restaurant.subscription; // Convert subscription string to Date object
    restaurant.themeColor = themeColor || restaurant.themeColor;
    if (req.file) {
      restaurant.logo = req.file.buffer.toString('base64');
    }
    restaurant.ownerId = restaurant.ownerId;
    await restaurant.save();

    return res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error editing restaurant:', error);
    return next(new AppError('Internal server error', 500));
  }
};

const deleteOwnerRestaurant = async (req, res, next) => {
  const ownerId = req.user.id; // Extract owner ID from token
  try {
    const restaurant = await Restaurant.findOne({ where: { ownerId } });
    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }
    const restaurantId = restaurant.restaurantId;
    await Restaurant.destroy({ where: { restaurantId } });
    await Owner.update({ hasRestaurant: false }, { where: { ownerId } });
    return res
      .status(200)
      .json({ message: 'Restaurant deleted successfully with its data' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return next(new AppError('Internal server error', 500));
  }
};


// Get all ingredients for a product
const getAllProductIngredients = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const ingredients = await ProductIngredient.findAll({ where: { productId } });
    if (ingredients.length === 0) {
      return next(new AppError('Ingredients not found', 404));
    }
    return res.status(200).json(ingredients);
  } catch (error) {
    console.error('Error getting ingredients:', error);
    return next(new AppError('Internal server error', 500));
  }
};





// Create a new product
// Create multiple products
const createProduct = async (req, res, next) => {
  const productData = req.body.product;
  const ingredientsData = req.body.ingredientData;
  const productExtrasData = req.body.productExtras;
  const ownerId = req.user.id; // Extract ownerId from token

  try {
    // Find the restaurant associated with the owner
    const restaurant = await Restaurant.findOne({ where: { ownerId } });
    if (!restaurant) {
      return next(new AppError('Restaurant not found for the owner', 404));
    }

        const { name, description, price, quantity, categoryId, size } = productData;
        // Create product with associated restaurantId
        const newProduct = await Product.create({
          name,
          description,
          price,
          quantity,
          categoryId,
          size,
          restaurantId: restaurant.restaurantId,
        });
        const ingredients = await Promise.all(ingredientsData.map(async (ingredient) => {
          const ingredientName = ingredient.ingredientName;
          const createdIngredient = await ProductIngredient.create({ ingredientName, productId: newProduct.productId });
          await createdIngredient.save();
          return createdIngredient;
        }));
        
        // Associate extras with the product
        const extras = await associateExtrasWithProduct(newProduct.productId, productExtrasData);
        
        res.status(201).json({
          message: 'Products created successfully',
          product: newProduct,
          ingredients,
          extras,
        });
  } catch (error) {
    console.error('Error creating products:', error);
    next(new AppError('Internal server error', 500));
  }
};

// Get all products
const getAllProducts = async (req, res, next) => {
  const ownerId = req.user.id; // Extract ownerId from token
  try {
    const restaurant = await Restaurant.findOne({ where: { ownerId } });
    const restaurantId = restaurant.restaurantId;

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
  const { name, description, price, quantity, category } = req.body;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.category = category || product.category;
    product.restaurantId = product.restaurantId;
    await product.save();
    return res.status(200).json(product);
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
  const ownerId = req.user.id; // Extract ownerId from token
  const { name, price } = req.body;
  try {
    const restaurant = await Restaurant.findOne({ where: { ownerId } });
    const restaurantId = restaurant.restaurantId;
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
  const ownerId = req.user.id; // Extract ownerId from token
  try {
    const restaurant = await Restaurant.findOne({ where: { ownerId } });
    const restaurantId = restaurant.restaurantId;
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

// Associate extras with a product
const associateExtrasWithProduct = async (productId, extrasData) => {
  try {
    // let associated;
    // Associate extras with the product using the ProductExtra table
    const extras = await Promise.all(
      extrasData.map(async (extraId) => {
        const extra = await Extra.findByPk(extraId);
        if (!extra) {
          return next(new AppError(`Extra with ID ${extraId} not found`, 404));
        }
        const associated = await ProductExtra.create({
          productId,
          extraId,
        });
        return associated;
      })
    );
    return extras;
  } catch (error) {
    console.error('Error associating extras with product:', error);
    next(new AppError('Internal server error', 500));
  }
};

// Get all extras associated with a product
const getAssociatedExtrasForProduct = async (req, res, next) => {
  const { productId } = req.params;

  try {
    // Find all entries in the ProductExtra table associated with the given product ID
    const productExtras = await ProductExtra.findAll({
      where: { productId },
    });
    if (productExtras.length === 0) {
      return next(new AppError('Extras for product not found', 404));
    }
    // Extract the associated extras from the productExtras
    // const associatedExtras = productExtras.map((entry) => entry.Extra);

    res.status(200).json({ productExtras });
  } catch (error) {
    console.error('Error fetching associated extras:', error);
    next(new AppError('Internal server error', 500));
  }
};

// Get all product extras for a specific restaurant
const getAllProductExtras = async (req, res, next) => {
  const ownerId = req.user.id; // Extract ownerId from token
  try {
    const restaurant = await Restaurant.findOne({ where: { ownerId } });
    const restaurantId = restaurant.restaurantId;
    const products = await Product.findAll({ where: { restaurantId } });
    const productIds = products.map((product) => product.productId);
    // Find all entries in the ProductExtra table
    const productExtras = await ProductExtra.findAll({
      where: { productId: { [Op.in]: productIds } },
    });
    if (productExtras.length === 0) {
      return next(new AppError('Product extras not found', 404));
    }
    res.status(200).json({ productExtras });
  } catch (error) {
    console.error('Error fetching all product extras:', error);
    next(new AppError('Internal server error', 500));
  }
};

// Edit a specific extra of a product in ProductExtra table
const editProductExtra = async (req, res, next) => {
  const { productId, extraId } = req.params;
  try {
    const updatedExtraId = req.body.extraId;
    await ProductExtra.update(
      { extraId: updatedExtraId || ProductExtra.extraId },
      { where: { productId, extraId } }
    );
    const productExtra = await ProductExtra.findOne({
      where: { productId, extraId: updatedExtraId },
    });
    return res.status(200).json(productExtra);
  } catch (error) {
    console.error('Error editing product extras:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Delete all extras for a product
const deleteProductExtras = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const productExtras = await ProductExtra.findAll({
      where: { productId },
    });
    if (productExtras.length === 0) {
      return next(new AppError('Product extras not found', 404));
    }
    await Promise.all(
      productExtras.map(async (productExtra) => {
        await productExtra.destroy();
      })
    );
    return res
      .status(200)
      .json({ message: 'Product extras deleted successfully' });
  } catch (error) {
    console.error('Error deleting product extras:', error);
    return next(new AppError('Internal server error', 500));
  }
};

//controlller to handle menu upload
const uploadMenu = async (req, res, next) => {
  try {
    // Extract data from form-data
    const { description } = req.body;
    const menuImage = req.file.buffer.toString('base64');
    const ownerId = req.user.id; // Extract ownerId from token
    // Find the restaurant associated with the owner
    const restaurant = await Restaurant.findOne({ where: { ownerId } });
    if (!restaurant) {
      return next(new AppError('Restaurant not found for the owner', 404));
    }

    // Save menu to database
    const menu = await RestaurantMenu.create({
      description,
      menuImage,
      restaurantId: restaurant.restaurantId,
    });

    // Send response
    res.status(201).json({ success: true, menu });
  } catch (error) {
    next(error);
  }
};

// controller to get menu
const getMenu = async (req, res, next) => {
  const ownerId = req.user.id; // Extract ownerId from token
  try {
    const restaurant = await Restaurant.findOne({ where: { ownerId } });
    const restaurantId = restaurant.restaurantId;
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

// Controller to create a new category
const createCategory = async (req, res, next) => {
  const { name } = req.body;
  const ownerId = req.user.id; // Extract ownerId from token
  // Find the restaurant associated with the owner
  const restaurant = await Restaurant.findOne({ where: { ownerId } });
  if (!restaurant) {
    return next(new AppError('Restaurant not found for the owner', 404));
  }
  try {
    const newCategory = await Category.create({
      name,
      restaurantId: restaurant.restaurantId,
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
  const ownerId = req.user.id; // Extract ownerId from token
  try {
    const restaurant = await Restaurant.findOne({ where: { ownerId } });
    const restaurantId = restaurant.restaurantId;
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
  getAllRestaurants,
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
  deleteOwnerRestaurant,
  createCategory,
  editCategory,
  deleteCategory,
  getRestaurantCategories,
  getAllProductIngredients,
  getRestaurantDeliveryAreas,
  getAllCategoryProducts,
  deleteRestaurantDeliveryAreas, // no routes for this
  // new
  // ownerUpdatePassword
};
