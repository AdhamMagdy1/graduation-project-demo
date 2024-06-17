// This function takes in an object with food and size properties and concatenates them into a single string
function concatenateFoodSize(orderDetails) {
  const food = orderDetails.food;
  const size = orderDetails.size;

  const concatenatedOrder = {};

  for (const foodItem in food) {
    if (food.hasOwnProperty(foodItem)) {
      const foodSize = size[foodItem] || ""; // Use empty string if there is no corresponding size
      const arrayContents = food[foodItem].join(" ").trim(); // Join array contents with a space and trim any extra whitespace
      const foodWithSizeAndContents = foodSize ? `${foodItem} ${foodSize} ${arrayContents}` : `${foodItem} ${arrayContents}`; // Concatenate food item, size, and array contents
      concatenatedOrder[foodItem] = foodWithSizeAndContents.trim(); // Trim any extra whitespace
    }
  }

  // Concatenate the values into a single string
  let concatenatedString = "";

  for (const key in concatenatedOrder) {
    if (concatenatedOrder.hasOwnProperty(key)) {
      concatenatedString += `${concatenatedOrder[key]}, `;
    }
  }
  
  // Remove the trailing comma and space
  concatenatedString = concatenatedString.slice(0, -2);
  
  console.log(concatenatedString);
  return concatenatedString;
}

module.exports = concatenateFoodSize;