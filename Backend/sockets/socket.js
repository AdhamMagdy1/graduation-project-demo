const {
  getModelRes,
  orderState,
  getModelRes2,
} = require('../middleware/conToModel');
const { instrument } = require('@socket.io/admin-ui');

const runSocket = (io, mainNamespace) => {
  mainNamespace.on('connection', (socket) => {
    console.log(`user ${socket.id} connected in chat namespace`);

    socket.on('message', (msg) => {
      const communicatedMessage = {
        message: msg,
        metadata: { restaurant_id: 11, customer_id: 1, socket_id: socket.id },
      };
      const emitMessage = getModelRes(mainNamespace, communicatedMessage);
      mainNamespace.to(socket.id).emit('message', emitMessage);
    });

    socket.on('changeOrderState', (order) => {
      const newOrder = orderState(order);
      socket.to(order.restaurantId).emit('order', newOrder);
    });

    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected in chat namespace`);
    });
  });

  instrument(io, {
    auth: false,
    mode: 'development',
  });
};

module.exports = { runSocket };
