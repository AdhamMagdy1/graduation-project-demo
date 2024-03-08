require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  Owner,
  Resturant,
  Product,
  Extra,
  productExtra,
} = require('../models/allModels'); // Import the Restaurant Owner model
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

// Controller function for restaurant owner login
const loginOwner = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the owner by email
    const owner = await Owner.findOne({ where: { email } });
    if (!owner) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, owner.password);
    if (!isValidPassword) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Generate JWT token
    const token = jwt.sign({ id: owner.ownerid }, process.env.JWT_SECRET, {
      expiresIn: '180h',
    });

    // Send token in response
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in restaurant owner:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller function to create restaurant information
const createRestaurant = async (req, res, next) => {
  const { name, description, Subscription } = req.body;
  const ownerId = req.user.id; // Extract owner ID from token

  try {
    // Create new restaurant
    const newRestaurant = await Resturant.create({
      name,
      description,
      Subscription: new Date(Subscription),
      ownerId,
    });
    return res.status(201).json(newRestaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return next(new AppError('Internal server error', 500));
  }
};
// Controller function to get restaurant information by ID
const getRestaurantById = async (req, res, next) => {
  const { restaurantId } = req.params;

  try {
    // Find restaurant by ID
    const restaurant = await Resturant.findByPk(restaurantId);
    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }

    return res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error getting restaurant:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Controller function to edit restaurant information by ID
const editRestaurantById = async (req, res, next) => {
  const { restaurantId } = req.params;
  const { name, description, Subscription } = req.body;

  try {
    // Find restaurant by ID
    const restaurant = await Resturant.findByPk(restaurantId);
    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }

    // Update restaurant details
    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.Subscription = new Date(Subscription) || restaurant.Subscription; // Convert Subscription string to Date object
    await restaurant.save();

    return res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error editing restaurant:', error);
    return next(new AppError('Internal server error', 500));
  }
};

// Create a new product
// Create multiple products
const createProducts = async (req, res, next) => {
  const productsData = req.body.products; // Array of products
  const ownerId = req.user.id; // Extract ownerId from token

  try {
    // Find the restaurant associated with the owner
    const restaurant = await Resturant.findOne({ where: { ownerId } });
    if (!restaurant) {
      return next(new AppError('Restaurant not found for the owner', 404));
    }

    const createdProducts = await Promise.all(
      productsData.map(async (productData) => {
        const { name, description, price, quantity } = productData;
        // Create product with associated restaurantId
        const newProduct = await Product.create({
          name,
          description,
          price,
          quantity,
          resturantId: restaurant.resturantId,
        });
        return newProduct;
      })
    );

    res
      .status(201)
      .json({
        message: 'Products created successfully',
        products: createdProducts,
      });
  } catch (error) {
    console.error('Error creating products:', error);
    next(new AppError('Internal server error', 500));
  }
};

// Create a new extra
const createExtra = async (req, res, next) => {
  const { name, price } = req.body;
  try {
    const newExtra = await Extra.create({ name, price });
    res
      .status(201)
      .json({ message: 'Extra created successfully', extra: newExtra });
  } catch (error) {
    console.error('Error creating extra:', error);
    next(new AppError('Internal server error', 500));
  }
};

// Associate extras with a product
const associateExtrasWithProduct = async (req, res, next) => {
  const { ProductProductId } = req.params;
  const extras = req.body.extras;

  try {
    // Find the product
    const product = await Product.findByPk(ProductProductId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }
    let associated;
    // Associate extras with the product using the ProductExtra table
    await Promise.all(
      extras.map(async (ExtraExtraId) => {
        const extra = await Extra.findByPk(ExtraExtraId);
        if (!extra) {
          return next(
            new AppError(`Extra with ID ${ExtraExtraId} not found`, 404)
          );
        }
        // Create an entry in the ProductExtra table to associate the product with the extra
        associated = await productExtra.create({
          ProductProductId,
          ExtraExtraId,
        });
      })
    );

    res
      .status(200)
      .json({
        message: 'Extras associated with product successfully',
        data: associated,
      });
  } catch (error) {
    console.error('Error associating extras with product:', error);
    next(new AppError('Internal server error', 500));
  }
};

const getAssociatedExtrasForProduct = async (req, res, next) => {
  const { ProductProductId } = req.params;

  try {
    // Find all entries in the ProductExtra table associated with the given product ID
    const productExtras = await productExtra.findAll({
      where: { ProductProductId }
    });

    // Extract the associated extras from the productExtras
    const associatedExtras = productExtras.map((entry) => entry.Extra);

    res.status(200).json({ associatedExtras });
  } catch (error) {
    console.error('Error fetching associated extras:', error);
    next(new AppError('Internal server error', 500));
  }
};
const getAllProductExtras = async (req, res, next) => {
  try {
    // Find all entries in the ProductExtra table
    const productExtras = await productExtra.findAll();

    res.status(200).json({ productExtras });
  } catch (error) {
    console.error('Error fetching all product extras:', error);
    next(new AppError('Internal server error', 500));
  }
};

module.exports = {
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
};
