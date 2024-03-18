require('dotenv').config();
module.exports = {
  //google auth2 configurations
  google: {
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL,
    passReqToCallback: true,
  },
};
