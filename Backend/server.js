require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
require('./services/googleAuthService');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const ping = require('./routes/pingRoute');

const app = express();

// express session
app.use(
  session({
    secret: process.env.secret,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Use the auth routes
app.use(authRoutes);

// Use the customer routes
app.use(customerRoutes);

// Use the ping routes
app.use(ping);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
