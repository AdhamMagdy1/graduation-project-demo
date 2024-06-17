const {
  getModelRes,
  orderState,
} = require('../middleware/conToModel');
const { instrument } = require('@socket.io/admin-ui');

const runSocket = (io, mainNamespace) => {
  mainNamespace.on('connection', (socket) => {
    console.log(`user ${socket.id} connected in chat namespace`);

    // Join restaurant room
    socket.on('joinRestaurantRoom', (restaurantId) => {
      socket.join(restaurantId);
      console.log(`User ${socket.id} joined restaurant room ${restaurantId}`);
    });

    socket.on('message', async (msg) => {
      // const communicatedMessage = {
      //   sender: 2,
      //   message: msg,
      //   metadata: { restaurant_id: 11, customer_id: 1, socket_id: socket.id },
      // };

      const { emitMessage, menuData, isImage } = await getModelRes(mainNamespace, msg);
      mainNamespace.to(socket.id).emit('message', emitMessage, isImage, menuData);
    });

    socket.on('changeOrderState', async (order, callback) => {
      const newOrder = await orderState(order);
      callback({
        status: 'success'
      });
    });

    socket.on('disconnecting', () => {
      // console.log(`User ${socket.id} left restaurant room ${restaurantId}`);
      console.log(socket.rooms);
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
