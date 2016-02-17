var express = require('express');
var app = express();
app.use(express.static(__dirname + '/assets'));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
	socket.on('send message', function(data) {
		io.sockets.emit('new message', data);
	});
});