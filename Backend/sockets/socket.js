// socket.js
const { getModelRes } = require('../middleware/conToModel');
const runSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`);

    socket.on('message', (msg) => {
      const communicatedMassage = { socketId: socket.id, message: msg };
      // Uncomment the following line if you plan to use connectToModelFunction
      const emitMessage = getModelRes(communicatedMassage);
      io.to(socket.id).emit('message', emitMessage);
    });

    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
    });
  });
};

module.exports = { runSocket };
