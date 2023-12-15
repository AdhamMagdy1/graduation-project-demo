// passport.js
require('dotenv').config();
const config = require('../config/config');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(config.google, function (
    request,
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    return done(null, profile);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
