require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const redis = require('redis');
const socketioredis = require('socket.io-redis');
const redislock = require('redislock');
const asynclock = require('async-lock');

const { GameInterface } = require('./app/game');
const GameManager = require('./app/manager');

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

mongoose.connect(process.env.PSEUDO_MONGO_URI, { useNewUrlParser: true });
const db = mongoose.connection;
if (dev) {
  db.dropCollection('games');
}
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const redisClient = redis.createClient();
const lock = redislock.createLock(redisClient, {
  timeout: 10000,
  retries: -1,
  delay: 100,
});
const locallock = new asynclock();

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
  let withLock;

  socket.on('joinGame', data => {
    name = data.name;
    socket.join(data.gameCode);

    withLock = (acquireFn, releaseFn) => {
      const lockKey = `game:${data.gameCode}`;
      locallock.acquire(lockKey, async (done) => {
        lock.acquire(lockKey).then(async () => {
          await acquireFn();
          return lock.release();
        }).then(done);
      }, async (err, ret) => {
        await releaseFn();
      });
    };

    withLock(
      async () => {
        game = await app.gm.retrieveGameModel(data.gameCode);
        if (game instanceof GameInterface) {
          if (game.playerExists(name)) {
            game.activatePlayer(name, socket.id);
          } else {
            game.addPlayer(name, socket.id);
          }
          await game.save();
        }
      }, () => {
        if (game instanceof GameInterface) {
          game.socketio(socket, game, name, withLock);
          socket.emit('ready', {});
        }
      }
    );
  });

  socket.on('exitGame', data => {
    withLock(
      async () => {
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
      }, () => {}
    );
  });

  socket.on('disconnect', async data => {
    if (game !== undefined) {
      withLock(
        async () => {
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
        }, () => {}
      );
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
