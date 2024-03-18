const getModelRes = (communicatedMassage) => {
  return `user: ${communicatedMassage.socketId} have sent this message ${communicatedMassage.message}`;
};
module.exports = {
  getModelRes,
};
