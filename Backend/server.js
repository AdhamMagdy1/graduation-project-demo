require('dotenv').config();
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const customerRoutes = require('./routes/customerRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const ping = require('./routes/pingRoute');
const cors = require('cors');
const bodyParser = require('body-parser');
const { testDbConnection } = require('./config/database');
const { errorHandler } = require('./utils/error');

// Connect to the database
testDbConnection();

// Import socket.io functionality
const { runSocket } = require('./sockets/socket');

const app = express();
// Enable CORS for all origins (for development)
app.use(cors());
app.use(bodyParser.json());

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

// Use the customer routes
app.use(customerRoutes);
// Use the customer routes
app.use('/resturant', restaurantRoutes);

// Use the ping routes
app.use(ping);

// Applying the errorHandler middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
