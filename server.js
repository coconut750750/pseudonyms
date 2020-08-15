require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const port = process.env.PSEUDONYMS_PORT || process.env.PORT || 5000;
const dev = process.env.NODE_ENV === 'development';

var app = express();
var server = require('http').Server(app);
app.io = require('socket.io')(server, {
  pingInterval: 10000,
  pingTimeout: 30000
});

const { GameInterface } = require('./app/game');
const GameManager = require('./app/manager');

mongoose.connect(process.env.PSEUDO_MONGO_URI, { useNewUrlParser: true });
const db = mongoose.connection;
if (dev) {
  db.dropCollection('games');
}
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.gm = new GameManager(dev, app.io, db.collection('stats'));
app.set('trust proxy', true); // for rate limiter

app.use(function(req, res, next) {
  req.gm = app.gm;
  req.io = app.io;
  req.statsCollection = db.collection("stats");
  req.feedbackCollection = db.collection("feedback");
  next();
});

// ROUTES
const registerRouter = require("./app/register");
const gameRouter = require("./app/routes");
app.use("/register/", registerRouter);
app.use("/game/", gameRouter);

// SOCKET IO SETUP
app.io.on('connect', function (socket) {
  var game;
  var name;
  var player;

  socket.on('joinGame', data => {
    name = data.name;
    game = app.gm.retrieveGame(data.gameCode);
    if (!(game instanceof GameInterface)) {
      return;
    }
    socket.join(data.gameCode);

    if (game.playerExists(name)) {
      game.activatePlayer(name, socket.id);
    } else {
      game.addPlayer(name, socket.id);
    }
    player = game.getPlayer(name);

    game.socketio(socket, game, name, player);
  });

  socket.on('exitGame', data => {
    if (player.isAdmin) {
      game.delete();
    } else if (game.hasStarted()) {
      game.deactivatePlayer(name);
    } else {
      game.removePlayer(name);
    }
  });

  socket.on('disconnect', data => {
    if (game !== undefined && game.playerExists(name)) {
      if (game.canRemove(name)) {
        game.removePlayer(name);
      } else {
        game.deactivatePlayer(name);
      }
    }
  });
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/dist')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
    });
}

server.listen(port, () => console.log(`Listening on port ${port}`));
