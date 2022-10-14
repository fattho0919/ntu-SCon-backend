import express from 'express';
import sequelize from './utils/database.js';
import router from './routes/routes.js';
const PORT = 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(router);

sequelize.sync(); 

app.listen(PORT, () => {
  console.log(`Smart Construction Server is listening on PORT ${PORT}.`);
})