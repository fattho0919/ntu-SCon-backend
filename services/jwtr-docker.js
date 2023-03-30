const Redis = require('redis');
const redisClient = Redis.createClient({
  url: 'redis://redis:6379'
});
const JWTR = require('jwt-redis').default;

redisClient.connect().then(() => {  // cannot use await outside the function
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
});

const jwtr = new JWTR(redisClient);

module.exports = jwtr;