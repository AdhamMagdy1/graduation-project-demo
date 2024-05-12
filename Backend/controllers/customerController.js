const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { redisClient } = require('../config/database'); // Import the redis client
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
      const token = jwt.sign({id: user.email }, process.env.JWT_SECRET, {
        expiresIn: '180h',
      });
      console.log(customer, created);
      res.json({ user, token });
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Invalid token' });
    }
  },

  createWaitingOrder: async (req, res, next) => {
    const customerEmail = req.user.id;
    const orderDetails = req.body.orderDetails;
    try {
      const customer = await Customer.findOne({ where: { email: customerEmail } });
      const customerId = customer.customerId;
      (await redisClient).json.set(`customerId:${customerId}`, '$', orderDetails);
      return res.status(201).json({ message: "Order created successfully"});
    } catch (error) {
      console.error("Error :", error);
      return next(new AppError("Internal Server Error", 500));
    }
  },

  createOrder: async (req, res, next) => {
    customerEmail = req.user.id;
    const { restaurantId } = req.body;
    try {
      const deliveyCost = 20;
      const customer = await Customer.findOne({ where: { email: customerEmail } });
      const customerId = customer.customerId;
      const address = await Address.findOne({ where: { customerId } });
      (await redisClient).json.get(`customerId:${customerId}`, '$').then( async (orderDetails) => {
        const order = await Order.create({
          deliveyCost,
          status: "pending",
          orderTime: new Date(),
          orderDetails,
          customerId,
          restaurantId,
          addressId: address.addressId
        });
        (await redisClient).json.del(`customerId:${customerId}`);
        return res.status(201).json({ order });
      });
    } catch (error) {
      console.error("Error :", error);
      return next(new AppError("Internal Server Error", 500));
    }
  },

  editOrderStatus: async (req, res, next) => {
    const orderId = req.params.orderId;
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        return next(new AppError("Order not found", 404));
      }
      if (order.status === "pending") {
        order.status = "finished";
        await order.save();
        return res.status(200).json({ order });
      } else {
        order.status = "pending";
        await order.save();
        return res.status(200).json({ order });
      }
    } catch (error) {
      console.error("Error :", error);
      return next(new AppError("Internal Server Error", 500));
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
    customerEmail = req.user.id;
    const { area, streetNumber, buildingNo, flatNumber, extraDescription } = req.body;
    try {
      const customer = await Customer.findOne({ where: { email: customerEmail } });
      const customerId = customer.customerId;
      const address = await Address.create({
        area,
        streetNumber,
        buildingNo,
        flatNumber,
        extraDescription,
        customerId
      })
      return res.status(201).json({ address });
    } catch (error) {
      console.error("Error :", error);
      return next(new AppError("Internal Server Error", 500));
    }
  },

  createCustomerPhoneNumber: async (req, res, next) => {
    customerEmail = req.user.id;
    const { phoneNumber } = req.body;
    try {
      const customer = await Customer.findOne({ where: { email: customerEmail } });
      const customerId = customer.customerId;
      const customerPhoneNumber = await CustomerPhoneNumber.create({
        phoneNumber,
        customerId
      });
      return res.status(201).json({ customerPhoneNumber });
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
  }

};

module.exports = customerController;