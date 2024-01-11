const dotenv = require('dotenv');
const express = require('express');
const {createServer} = require('node:http');
const {Server} = require('socket.io');
const { instrument } = require("@socket.io/admin-ui");
const connectToModel = require('./connectToModelFunction');

dotenv.config({path: '../.env'});

const frontEndPort = process.env.FRONTEND_PORT;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [`http://localhost:${frontEndPort}`, 'https://admin.socket.io'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`);
    
    socket.on("message", (msg) => {
        const communicatedMassage = {socketId: socket.id, message: msg};
        const emitMessage = connectToModel(communicatedMassage);
        io.to(socket.id).emit('message', emitMessage);
    });

    socket.on("disconnect", () => {
        console.log(`user ${socket.id} disconnected`);
    });
});

instrument(io, {
    auth: false,
    mode: "development",
});

const socketPort = process.env.SOCKET_PORT;
server.listen(socketPort, () => {
    console.log(`server running at http://localhost:${socketPort}`);
});