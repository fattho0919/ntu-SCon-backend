const jwt = require('jsonwebtoken');
const jwtr = require('../jwtr');
require('dotenv').config();

function jwtGenerator(user_id) {
  const payload = {
    jti: user_id
  };

  return jwtr.sign(payload, process.env.jwtSecret, { expiresIn: 86400 }); // Expire in 1 day
};

module.exports = jwtGenerator;
