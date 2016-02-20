var express = require('express');
var app = express();
app.use(express.static(__dirname + '/assets'));

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var nicknames = [];

server.listen(8080);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
	socket.on('new user', function(data, callback) {
		if (nicknames.indexOf(data) != -1) {
			callback(false);
		} else {
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			updateNicknames();
		}
	});

	function updateNicknames() {
		io.sockets.emit('usernames', nicknames);
	}

	socket.on('send message', function(data) {
		io.sockets.emit('new message', {msg: data, nick:socket.nickname});
	});

	socket.on('disconnect', function(data) {
		if(!socket.nickname) return;
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		updateNicknames();
	});

});