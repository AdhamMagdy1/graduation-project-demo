const { Resturant_worker } = require('../models/allModels'); // Import the Restaurant Worker model
const { AppError } = require('../utils/error'); // Import the custom error class

// Controller function to create a new restaurant worker
const createRestaurantWorker = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const existingWorker = await Resturant_worker.findOne({ where: { email } });
    if (existingWorker) {
      return next(new AppError('Email is already in use', 400));
    }

    // Create new restaurant worker
    const newWorker = await Resturant_worker.create({ name, email, password });
    return res.status(201).json(newWorker);
  } catch (error) {
    console.error('Error creating restaurant worker:', error);
    return next(new AppError('Internal server error', 500));
  }
};

module.exports = {
  createRestaurantWorker,
};
