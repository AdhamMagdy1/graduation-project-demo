require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

module.exports = {
  createOwner,
  loginOwner,
};
