const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/authMiddleware');
// Base route
router.get('/home', (req, res) => {
  res.send('Home Page');
});

// failed route if the authentication fails
router.get('/failed', (req, res) => {
  console.log('User is not authenticated');
  res.send('Failed');
});

// Success route if the authentication is successful
router.get('/success', isLoggedIn, (req, res) => {
  console.log('You are logged in');
  res.send(`Welcome ${req.user.displayName}`);
});
// Route that logs out the authenticated user
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('Error while destroying session:', err);
    } else {
      req.logout(() => {
        console.log('You are logged out');
        res.redirect('/home');
      });
    }
  });
});

module.exports = router;