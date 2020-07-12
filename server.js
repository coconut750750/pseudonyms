const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

require('dotenv').config();
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server, {
  pingInterval: 10000,
  pingTimeout: 30000
});

const GameInterface = require('./app/game');
const GameManager = require('./app/manager');

const registerRouter = require("./app/register");
const gameRouter = require("./app/routes");
const authRouter = require("./app/auth");

const port = process.env.PSEUDONYMS_PORT || process.env.PORT || 5000;
const dev = process.env.NODE_ENV === 'development';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.io = io;
app.gm = new GameManager(dev);
app.set('trust proxy', true); // for rate limiter

const mongoose = require('mongoose');
mongoose.connect(process.env.PSEUDO_MONGO_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const MongoStore = require('connect-mongo')(session);

const usersCollection = db.collection("users");

require('./app/passport')(usersCollection);
const appSession = session({
  secret: process.env.SECRET,
  store: new MongoStore({ mongooseConnection: db })
});
app.use(appSession);
app.use(passport.initialize());
app.use(passport.session());

let sharedsession = require("express-socket.io-session");
app.io.use(sharedsession(appSession, {
    autoSave:true
})); 

app.use(function(req, res, next) {
  req.gm = app.gm;
  req.io = app.io;
  req.statsCollection = db.collection("stats");
  req.feedbackCollection = db.collection("feedback");
  req.usersCollection = usersCollection;
  next();
});
app.use("/register/", registerRouter);
app.use("/game/", gameRouter);
app.use("/auth/", authRouter(usersCollection));

app.io.on('connect', function (socket) {
  var game;
  var name;
  var player;

  socket.on('joinGame', data => {
    name = socket.handshake.session?.passport?.user?.username || data.name;
    game = app.gm.retrieveGame(data.gameCode);
    if (!(game instanceof GameInterface)) {
      return;
    }
    socket.join(data.gameCode);

    player = game.join(socket, name);
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
    if (game !== undefined) {
      if (game.canRemove(name)) {
        game.removePlayer(name);
      } else if (game.playerExists(name)) {
        game.deactivatePlayer(name);
      }
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
