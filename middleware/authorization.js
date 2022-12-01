const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {  // next can keep going to the route
  try {

    // console.log(req);
    
    const jwtToken = req.header("token"); // from client-side

    if (!jwtToken) {
      return res.status(403).json("Not Authorized");
    }

    const payload = jwt.verify(jwtToken, process.env.jwtSecret);  // check if it's valid, if yes, return payload then we can use in the route

    req.user = payload.user;

    next(); // next() cannot be missed
  } catch (error) {
    console.error(error.message);
    return res.status(403).json("Not Authorized");
  }
}