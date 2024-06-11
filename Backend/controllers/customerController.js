const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { AppError } = require('../utils/error'); // Import the custom error class

const {
  Order,
  Address,
  CustomerPhoneNumber,
  Customer
} = require('../models/allModels'); // Import the customer related models


const customerController = {
  login: async (req, res, next) => {
    try {
      // Check if authorization header exists
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
      ) {
        // Handle case where authorization header is missing or doesn't start with 'Bearer'
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // Extract the token from the authorization header
      const idtoken = req.headers.authorization.split(' ')[1];
  
      const ticket = await client.verifyIdToken({
        idToken: idtoken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const user = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };
      const [customer, created] = await Customer.findOrCreate({
        where: { email: user.email },
        defaults: {
          name: user.name,
          email: user.email,
        },
      });
      // Generate JWT for user
      const token = jwt.sign({id: customer.customerId }, process.env.JWT_SECRET, {
        expiresIn: '180h',
      });
      res.json({ customer, token });
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Invalid token' });
    }
  },

  getAllOrders : async (req, res, next) => {
    try {
      const orders = await Order.findAll();
      if (orders.length === 0) {
        return next(new AppError("No orders found", 404));
      }
      return res.status(200).json({ orders });
    } catch (error) {
      console.error("Error :", error);
      return next(new AppError("Internal Server Error", 500));
    }
  },

  createAddress: async (req, res, next) => {
    const customerId = req.user.customerId;
    const { addressDescription } = req.body;
    try {
      const address = await Address.create({
        addressDescription,
        customerId
      })
      return res.status(201).json({ address });
    } catch (error) {
      console.error("Error :", error);
      return next(new AppError("Internal Server Error", 500));
    }
  },

  getAllCustomers: async (req, res, next) => {
    try {
      const customers = await Customer.findAll();
      if (customers.length === 0) {
        return next(new AppError("No customers found", 404));
      }
      return res.status(200).json({ customers });
    } catch (error) {
      console.error("Error :", error);
      return next(new AppError("Internal Server Error", 500));
    }
  },

  // getAllCustomersPhoneNumber: async (req, res, next) => {
  //   try {
  //     const customerPhoneNumbers = await CustomerPhoneNumber.findAll();
  //     if (customerPhoneNumbers.length === 0) {
  //       return next(new AppError("No customer phone numbers found", 404));
  //     }
  //     return res.status(200).json({ customerPhoneNumbers });
  //   } catch (error) {
  //     console.error("Error :", error);
  //     return next(new AppError("Internal Server Error", 500));
  //   }
  // },

  deleteAllOrders: async (req, res, next) => {
    try {
      const orders = await Order.destroy({ truncate: true });
      return res.status(200).json({ message: "All orders deleted successfully" });
    } catch (error) {
      console.error("Error :", error);
      return next(new AppError("Internal Server Error", 500));
    }
  },
};

module.exports = customerController;