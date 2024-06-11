const { Order,/* CustomerPhoneNumber,*/ Feedback, Address } = require('../models/allModels'); // Import the customer related models

// const fetch = require('node-fetch');

const getModelRes = async (mainNamespace, communicatedMessage) => {
  try {
    let result = ''; // Initialize an empty string to store the result
    
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

    // Looping through each object in the response array
    for (const data of responseData) {
      if (data.hasOwnProperty('custom')) {
        // If 'custom' property exists, call the customAction function and append its response to the result
        const customResponse = await customAction(mainNamespace, data.custom);
        result += customResponse;
      } else {
        // If 'custom' property doesn't exist, append the message to the result
        result += data.text;
      }
    }
    return result; // Return the concatenated result string
  } catch (error) {
    console.error('Error:', error);
    return 'Error occurred while processing the request.';
  }
};

// Custom action function
const customAction = async (mainNamespace, customObject) => {
  if (customObject.code == 420) {
    // If code is 420, return nothing
    return '';
  } else if (customObject.code == 422) {
    // If code is 422, call createOrderMessage function and return food extra and food size
    const { restaurant_id, customer_id , socket_id, phone_number,address_id } = customObject;
    const orderDetails = {
      food: customObject.food_extra,
      size: customObject.food_size,
    };
    const newOrder = await Order.create({
      deliveryCost: 20,
      orderDetails,
      phoneNumber: phone_number,
      addressId: address_id || 1,
      restaurantId: restaurant_id || 57,
      customerId: customer_id || 1
    });
    const order = await Order.findOne({  where: { OrderId: newOrder.OrderId }, include: [ Address ] });
    mainNamespace.to(restaurant_id).emit('order', order);
    return '';
  }else if(customObject.code == 422){
    const { restaurant_id,feedback } = customObject;
    const feedbackRecord =await Feedback.create({
        message:feedback,
        restaurantId:restaurant_id
    });
    return '';
    

  } else {
    // For other codes, return a default message
    return 'Default custom action performed.';
  }
};

const orderState = async (order) => {
  await Order.update({ status: order.newStatus }, { where: { OrderId: order.orderId } });
};

module.exports = {
  getModelRes,
  orderState,
};
