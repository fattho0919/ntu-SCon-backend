const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const PORT = 3000;

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));																	//	HTTP請求logger

// register and login
app.use('/auth', require('./routes/jwtAuth'));

app.use('/dashboard', require('./routes/dashboard'));

app.use('/users', require('./routes/users'));

app.use('/projects', require('./routes/projects'));

app.use('/issues', require('./routes/issues'));

app.use('/manage', require('./routes/manage'));

app.listen(PORT, () => {
	console.log(`Server is listening on PORT ${PORT}`);
});