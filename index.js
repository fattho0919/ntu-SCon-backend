const express = require('express');
const app = express();
const cors = require('cors');
const { propfind } = require('./routes/jwtAuth');
const PORT = 3000;

// middleware
app.use(express.json());
app.use(cors());

// register and login
app.use('/auth', require('./routes/jwtAuth'));

app.use('/dashboard', require('./routes/dashboard'));

app.use('/projects', require('./routes/projects'));

app.use('/users', require('./routes/users'));

app.use('/manage', require('./routes/manage'));

app.listen(PORT, () => {
	console.log(`Server is listening on PORT ${PORT}`);
});