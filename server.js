const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

const Pseudo = require('./app/pseudo');

const port = process.env.PORT || 5000;
const dev = process.env.NODE_ENV === 'dev';

const registerRouter = require("./routes/register");

app.use(bodyParser.json());
app.io = io;
app.pseudo = new Pseudo(dev);

app.get('/ping', (req, res) => {
  res.send();
});

app.use(function(req, res, next) {
  req.pseudo = app.pseudo;
  next();
});
app.use("/", registerRouter);

app.io.on('connect', function (socket) {
  var game;
  var name;
  var player;

  socket.on('join', data => {
    name = data.name;
    game = app.pseudo.retrieveGame(data.gameCode);

    if (game.playerExists(name)) {
      game.activatePlayer(name, socket);
    } else {
      game.addPlayer(name, socket);
    }
    player = game.getPlayer(name);

    if (game.started) {
      socket.emit('start', {});
    }
  });

  socket.on('getPlayers', data => {
    socket.emit('players', game.getPlayerData());
  });

  socket.on('startGame', data => {
    if (game.enoughPlayers()) {
      game.start();
    } else {
      socket.emit('message', { message: 'Not enough players have joined the game' });
    }
  });

  socket.on('disconnect', data => {
    if (game !== undefined && game.playerExists(name)) {
      game.deactivatePlayer(name);
    }
  });
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

server.listen(port, () => console.log(`Listening on port ${port}`));
