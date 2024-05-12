// const getModelRes = (communicatedMassage) => {
//   return `user: ${communicatedMassage.socketId} have sent this message ${communicatedMassage.message}`;
// };
// module.exports = {
//   getModelRes,
// };

const fetch = require('node-fetch');

const getModelRes = async (communicatedMessage) => {
  try {
    let result = ''; // Initialize an empty string to store the result

    // Sending the communicated message via fetch POST request
    const response = await fetch(
      'http://localhost:5005/webhooks/rest/webhook',
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
        const customResponse = await customAction(data.custom);
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
// Custom action function
const customAction = (customObject) => {
  if (customObject.code === 420) {
    // If code is 420, return nothing
    return '';
  } else if (customObject.code === 422) {
    // If code is 422, call createOrderMessage function and return food extra and food size
    const foodExtra = customObject.foodExtra || '';
    const foodSize = customObject.foodSize || '';
    return `Food Extra: ${foodExtra}, Food Size: ${foodSize}`;
  } else {
    // For other codes, return a default message
    return 'Default custom action performed.';
  }
};

module.exports = {
  getModelRes,
};
