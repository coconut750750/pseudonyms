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
  req.io = app.io;
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
    socket.join(data.gameCode);

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

  socket.on('startGame', data => {
    const { options } = data;
    if (game.enoughPlayers()) {
      game.start(options);
    } else {
      socket.emit('message', { message: 'Not enough players have joined the game' });
    }
  });

  socket.on('selectTeam', data => {
    const { team } = data;
    game.setTeam(name, team === 'red');
  });

  socket.on('randomizeTeams', data => {
    game.randomizeTeams();
  });

  socket.on('confirmTeams', data => {
    game.confirmTeams();
  });

  socket.on('setKey', data => {
    game.setKey(name);
  });

  socket.on('confirmRoles', data => {
    game.confirmRoles();
  });

  socket.on('sendClue', data => {
    if (game.turn === player.team && player.isKey()) {
      const { clue, count } = data;
      game.sendClue(clue, count);
    }
  });

  socket.on('endTurn', data => {
    if (game.turn === player.team) {
      game.endTurn();
    }
  });

  socket.on('revealWord', data => {
    if (game.turn === player.team && !player.isKey()) {
      const { r, c } = data;
      game.reveal(r, c);
    }
  });

  socket.on('newGame', data => {
    if (!game.started) {
      game.reset();
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
