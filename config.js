require('dotenv').config();

export const config = {
  development: {
    username: process.env.DB_USER,
    database: process.env.DB_DATABASE,
  },
  auth: {
    secret: process.env.jwtSecret,
  },
};
