const jwt = require('jsonwebtoken');
const jwtr = require('../services/jwtr');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token"); 

    if (!jwtToken) {
      return res.status(403).json("您尚未取得授權");
    }

    await jwtr.verify(jwtToken, process.env.jwtSecret);

    next();
  } catch (error) {
    console.error(error.message);
    return res.status(403).json("您尚未取得授權");
  }
};
