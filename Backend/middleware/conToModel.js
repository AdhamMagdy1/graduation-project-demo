// const getModelRes = (communicatedMassage) => {
//   return `user: ${communicatedMassage.socketId} have sent this message ${communicatedMassage.message}`;
// };
// module.exports = {
//   getModelRes,
// };

const fetch = require('node-fetch');

const getModelRes = async (communicatedMessage) => {
  try {
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
        // If 'custom' property exists, call the customAction function and return its response
        const customResponse = customAction(data.custom);
        return customResponse;
      } else {
        // If 'custom' property doesn't exist, return the message
        return data.text;
      }
    }
  } catch (error) {
    console.error('Error:', error);
    return 'Error occurred while processing the request.';
  }
};

// Custom action function
const customAction = (customObject) => {
  // Implement custom action logic here based on the customObject
  // For now, just returning a sample response
  return 'Custom action performed successfully.';
};

module.exports = {
  getModelRes,
};
