const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const PORT = 3000;

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));																	//	HTTP請求logger

app.use('/auth', require('./routes/jwtAuth'));

app.use('/dashboard', require('./routes/dashboard'));

app.use('/users', require('./routes/users'));

app.use('/projects', require('./routes/projects'));

app.use('/issues', require('./routes/issues'));

app.use('/locations', require('./routes/locations'));

app.use('/tasks', require('./routes/tasks'));

app.use('/permissions', require('./routes/permissions'));

app.use('/worksOn', require('./routes/worksOn'));

app.use('/corporations', require('./routes/corporations'));

app.listen(PORT, () => {
	console.log(`Server is listening on PORT ${PORT}`);
});