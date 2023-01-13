const jwt = require('jsonwebtoken');
const jwtr = require('../services/jwtr');
require('dotenv').config();

module.exports = async (req, res, next) => {
  console.log(req.headers);
  console.log(req.body);
  try {
    const jwtToken = req.header("authorization").substring(7);
    console.log(jwtToken);

    if (!jwtToken) {
      return res.status(403).json('您尚未取得授權');
    }

    await jwtr.verify(jwtToken, process.env.jwtSecret);

    next();
  } catch (error) {
    console.error(error.message);
    return res.status(403).send('您尚未取得授權');
  }
};
