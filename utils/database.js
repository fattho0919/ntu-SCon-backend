import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('loginDB', 'root', 'mysql', {
	dialect: 'mysql',
	host: 'localhost', 
});

export default sequelize;