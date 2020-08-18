require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socketioredis = require('socket.io-redis')

const port = process.env.PSEUDONYMS_PORT || process.env.PORT || 5000;
const dev = process.env.NODE_ENV === 'development';

var app = express();
var server = require('http').Server(app);
app.io = require('socket.io')(server, {
  pingInterval: 10000,
  pingTimeout: 30000,
  transports: [ 'websocket', 'polling' ],
});
app.io.adapter(socketioredis({ host: 'localhost', port: 6379 }))

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
  let game;
  let name;
  let player;

  socket.on('joinGame', async data => {
    name = data.name;
    game = await app.gm.retrieveGameModel(data.gameCode);
    if (!(game instanceof GameInterface)) {
      return;
    }
    socket.join(data.gameCode);

    if (game.playerExists(name)) {
      game.activatePlayer(name, socket.id);
    } else {
      game.addPlayer(name, socket.id);
    }
    await game.save();

    game.socketio(socket, game, name);
    socket.emit('ready', {});
  });

  socket.on('exitGame', async data => {
    const exists = await game.reload();
    if (!exists) {
      return;
    }
    const player = game.getPlayer(name);
    if (player === undefined) {
      return;
    }
    if (player.isAdmin) {
      game.delete();
    } else {
      if (game.hasStarted()) {
        game.deactivatePlayer(name);
      } else {
        game.removePlayer(name);
      }
      game.save();
    }
  });

  socket.on('disconnect', async data => {
    if (game !== undefined) {
      const exists = await game.reload();
      if (exists && game.playerExists(name)) {
        if (game.canRemove(name)) {
          game.removePlayer(name);
        } else {
          game.deactivatePlayer(name);
        }
        if (!game.allDeactivated()) {
          game.save();
        }
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
