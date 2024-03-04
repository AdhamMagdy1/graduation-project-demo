const { Owner } = require('../models/allModels'); // Import the Restaurant Owner model
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

    // Create new restaurant Owner
    const newOwner = await Owner.create({ name, email, password });
    return res.status(201).json(newOwner);
  } catch (error) {
    console.error('Error creating restaurant Owner:', error);
    return next(new AppError('Internal server error', 500));
  }
};

module.exports = {
  createOwner,
};
