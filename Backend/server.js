require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const ping = require('./routes/pingRoute');

// Import socket.io functionality
const { runSocket } = require('./sockets/socket');

const app = express();

// express session
app.use(
  session({
    secret: process.env.secret,
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Create the server and attach socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      `http://localhost:${process.env.FRONTEND_PORT}`,
      'https://admin.socket.io',
    ],
    credentials: true,
  },
});

// Import socket.js functionality and run it
runSocket(io);

// Use the auth routes
app.use(authRoutes);

// Use the customer routes
app.use(customerRoutes);

// Use the ping routes
app.use(ping);

// Start the server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
