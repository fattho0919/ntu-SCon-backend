const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const API_PORT = 3000;
const SOCKET_PORT = 3001;

// Socket server
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	cors: {
		origin: "*",
	},
});

io.on('connection', (socket) => {
	console.log(`a user connected with ${socket.id}`);

	socket.on('send', (message) => {
		console.log(message);

		// 轉送到對應廠商


	});
});

server.listen(SOCKET_PORT);

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// User related
app.use('/auth', require('./routes/auth'));
app.use('/corporations', require('./routes/corporations'));
app.use('/users', require('./routes/users'));

// Project related
app.use('/projects', require('./routes/projects'));
app.use('/issues', require('./routes/issues'));
app.use('/locations', require('./routes/locations'));
app.use('/attachments', require('./routes/attachments'));
app.use('/tasks', require('./routes/tasks'));
app.use('/labels', require('./routes/labels'));
app.use('/notifications', require('./routes/notifications'));

// Permission related
app.use('/permissions', require('./routes/permissions'));
app.use('/participate', require('./routes/participate'));
app.use('/contractors', require('./routes/contractors'));
app.use('/sheet', require('./routes/sheet'));

app.listen(API_PORT, () => {
	console.log(`Server is listening on PORT ${API_PORT}`);
});