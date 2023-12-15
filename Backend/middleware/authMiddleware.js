// Middleware used in protected routes to check if the user has been authenticated
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    //uncomment this to check the user data and use it as you want e.g. (storing user data in database)
    console.log(req.user);
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = {
  isLoggedIn,
};
