const passport = require('passport');
const googleAuthService = require('../services/googleAuthService');

// Google authentication middleware
exports.googleAuth = passport.authenticate('google', {
  scope: ['email', 'profile'],
});

// Google authentication callback middleware
exports.googleAuthCallback = passport.authenticate('google', {
  failureRedirect: '/failed',
});
