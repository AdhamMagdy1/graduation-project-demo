// socket.js
const { getModelRes } = require('../middleware/conToModel');
const { instrument } = require("@socket.io/admin-ui");

const runSocket = (io, mainNamespace, restaurantNamespace) => {
  mainNamespace.on('connection', (socket) => {
    console.log(`user ${socket.id} connected in chat namespace`);

    socket.on('message', (msg) => {
      const communicatedMassage = { socketId: socket.id, message: msg };
      // Uncomment the following line if you plan to use connectToModelFunction
      const emitMessage = getModelRes(communicatedMassage);
      mainNamespace.to(socket.id).emit('message', emitMessage);
    });

    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected in chat namespace`);
    });
  });

  instrument(io, {
    auth: false,
    mode: "development",
  });

  const order = {
    orderId: 123,
    orderName: "Pizza",
    orderQuantity: 2,
    state: "recieved"
  };
  restaurantNamespace.on('connection', (socket) => {
    console.log(`restaurant ${socket.id} connected in restaurant namespace`);
    // function to get order after being saved in database
    // const order = getOrder();
    socket.emit("order", order);
    socket.on('changeState', (order) => {
      order.state = "finished";
      // sendToDatabase(order);
      socket.emit("order", order);
    });
    socket.on('disconnect', () => {
      console.log(`restaurant ${socket.id} disconnected in restaurant namespace`);
    });
  })

};

module.exports = { runSocket };
