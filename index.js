var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('dist'));

// app.get('/', function(req, res){
//   res.sendfile('index.html');
// });
//
// app.get('/app.js', function(req, res){
//   res.sendfile('app.js');
// });

var players = [];

// socket.on - приём сообщения
// io.emit - отправка сообщения
io.on('connection', function(socket){

  //io.emit('players', players);
  socket.on('chat message', function (msg) {
    //data.push(msg);
    io.emit('chat message', msg);
  });
  socket.on('nik message', function (msg) {
    io.emit('nik message', msg);
  });

  socket.on("player", function (player) {
    //console.log("player",player);
    //players.push(player);
    io.emit('player', player);
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
