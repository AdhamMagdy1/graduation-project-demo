require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
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

// const { createAdapter } = require("@socket.io/postgres-adapter");
// const { Pool } = require("pg");





// Import socket.io functionality
const { runSocket } = require('./sockets/socket');

const app = express();
// Enable CORS for all origins (for development)
app.use(cors());
app.use(bodyParser.json());

// Add Morgan logging middleware
app.use(morgan('dev'));

// Create the server and attach socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      `http://localhost:${process.env.FRONTEND_PORT}`,
      'https://admin.socket.io',
      "http://localhost:3001"
    ],
    credentials: true,
  },
});


// const pool = new Pool({
//   user: SOCKET_DATABASE_USERNAME,
//   host: SOCKET_DATABASE_HOST,
//   database: SOCKET_DATABASE_NAME,
//   password: SOCKET_DATABASE_PASSWORD,
//   port: SOCKET_DATABASE_PORT,
// });

// const adapter = createAdapter(pool);
// io.adapter(adapter);

const chat = io.of('/chat');
const restaurant = io.of('/restaurant');

// Import socket.js functionality and run it
runSocket(io, chat, restaurant);

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
