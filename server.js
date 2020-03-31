const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

const Pseudo = require('./app/pseudo');

const port = process.env.PORT || 5000;
const dev = process.env.NODE_ENV === 'dev';

const apiRouter = require("./routes/api");

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
app.use("/", apiRouter);

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
  });

  socket.on('updateOptions', data => {
    if (!game.started) {
      const { options } = data;
      game.broadcast('options', { options });
    }
  });

  socket.on('startGame', data => {
    if (game.canStart()) {
      const { options } = data;
      if (game.enoughPlayers()) {
        game.start(options);
      } else {
        socket.emit('message', { message: 'Not enough players have joined the game' });
      }
    }
  });

  socket.on('selectTeam', data => {
    if (game.canSetTeam()) {
      const { team } = data;
      game.setTeam(name, team === 'red');
    }
  });

  socket.on('randomizeTeams', data => {
    if (game.canSetTeam()) {
      game.randomizeTeams();
    }
  });

  socket.on('confirmTeams', data => {
    game.confirmTeams();
  });

  socket.on('setKey', data => {
    if (game.canSetRole()) {
      game.setKey(name);
    }
  });

  socket.on('confirmRoles', data => {
    game.confirmRoles();
  });

  socket.on('sendClue', data => {
    const { clue, count } = data;
    if (game.canSendClue(player)) {
      if (game.validClue(clue)) {
        game.sendClue(clue, count);
      } else {
        socket.emit('message', { message: 'Invalid Clue!' });
      }
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

  socket.on('exitGame', data => {
    if (player.isAdmin) {
      game.end();
    } else if (game.started) {
      game.deactivatePlayer(name);
    } else {
      game.removePlayer(name);
    }
  });

  // retrieving info for reconnected clients
  socket.on('getPhase', data => {
    if (game.phase !== 'lobby') {
      socket.emit('phase', { phase: game.phase });
    }
  });

  socket.on('getBoard', data => {
    game.connectSendBoard(player);
  });

  socket.on('getKey', data => {
    game.connectSendKey(player);
  });

  socket.on('getTurn', data => {
    game.connectSendTurn(player);
  });

  socket.on('getClue', data => {
    game.connectSendClue(player);
  });

  socket.on('getWinner', data => {
    game.connectSendWinner(player);
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
