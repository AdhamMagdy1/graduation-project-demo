const { Order, Feedback, Address, Customer, RestaurantMenu } = require('../models/allModels'); // Import the customer related models
const concatenateFoodSize = require('../utils/orderFormate'); // Import the orderFormate utility

// const fetch = require('node-fetch');

const getModelRes = async (mainNamespace, communicatedMessage) => {
  try {
    // Sending the communicated message via fetch POST request
    const response = await fetch(
      'http://127.0.0.1:5005/webhooks/rest/webhook',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(communicatedMessage),
      }
    );
    
    // Parsing the response as JSON
    const responseData = await response.json();
    let result = ''; // Initialize an empty string to store the result
    let menuData;
    let isImage;

    // Looping through each object in the response array
    for (const data of responseData) {
      if (data.hasOwnProperty('custom')) {
        
        // If 'custom' property exists, call the customAction function and append its response to the result
        const customResponse = await customAction(mainNamespace, data.custom);
        if (data.custom.code == 444) {
          menuData = customResponse.menusData;
          isImage = customResponse.isImage
        }

      } else {
        // If 'custom' property doesn't exist, append the message to the result
        result += data.text + ' ';
      }
    }
    return { emitMessage: result, menuData, isImage }; // Return the concatenated result string
  } catch (error) {
    console.error('Error:', error);
    return 'Error occurred while processing the request.';
  }
};

// Custom action function
const customAction = async (mainNamespace, customObject) => {
  if (customObject.code == 422) {
    // If code is 422, call createOrderMessage function and return food extra and food size
    const { restaurant_id, customer_id, address_id, phone_number, total_price } = customObject;
    const orderDetails = concatenateFoodSize({ food: customObject.food_extra, size: customObject.food_size });
    const newOrder = await Order.create({
      totalPrice: total_price,
      orderDetails: { "food": orderDetails },
      phoneNumber: phone_number,
      addressId: address_id,
      restaurantId: restaurant_id,
      customerId: customer_id
    });
    const order = await Order.findOne({  where: { orderId: newOrder.orderId }, include: [ Address ] });
    mainNamespace.to(restaurant_id).emit('order', order);

  } else if (customObject.code == 440) {
    const { restaurant_id, feedback } = customObject;
    const feedbackRecord = await Feedback.create({
        message: feedback,
        restaurantId: restaurant_id
    });

  } else if (customObject.code == 444) {
    const { restaurant_id } = customObject;
    const menus = await RestaurantMenu.findAll({ where: { restaurantId: restaurant_id }, attributes: ['menuImage'] });
    return { menusData: menus, isImage: true };
  }
};

const orderState = async (order) => {
  await Order.update({ status: order.newStatus }, { where: { orderId: order.orderId } });
};

module.exports = {
  getModelRes,
  orderState,
};
