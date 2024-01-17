const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require('jsonwebtoken');
require('dotenv').config();

const customerController = {
  login: async (req, res, next) => {
    try {
      
      const ticket = await client.verifyIdToken({
        idToken: req.body.credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const user = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };

      // Generate JWT for user
      const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.json({ user, token });
      // console.log({ user, token })
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Invalid token' });
    }
  },

};

module.exports = customerController;
