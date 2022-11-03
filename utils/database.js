import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('loginDB', 'root', 'mySQL3306_', {
	dialect: 'mysql',
	host: 'localhost', 
});

export default sequelize;