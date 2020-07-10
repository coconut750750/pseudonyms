const express = require("express");
const router = express.Router();

const { checkName } = require('./utils');
const { CLASSIC, DUET, RANKED } = require('./common/const');

router.post('/classic/create', (req, res) => {
  let options = req.body;
  options.statsCollection = req.statsCollection;
  const game = req.gm.createClassicGame(req.body, (code, event, data) => req.io.to(code).emit(event, data));
  
  res.send({
    gameCode: `${game.code}`,
    mode: CLASSIC,
  });
});

router.post('/duet/create', (req, res) => {
  let options = req.body;
  options.statsCollection = req.statsCollection;
  const game = req.gm.createDuetGame(req.body, (code, event, data) => req.io.to(code).emit(event, data));
  
  res.send({
    gameCode: `${game.code}`,
    mode: DUET,
  });
});

router.post('/ranked/create', (req, res) => {
  if (req.user === undefined) {
    return res.status(400).send({ message: 'Must be logged in' });
  }
  let options = req.body;
  options.statsCollection = req.statsCollection;
  options.usersCollection = req.usersCollection;
  const game = req.gm.createRankedGame(req.body, (code, event, data) => req.io.to(code).emit(event, data));
  
  res.send({
    gameCode: `${game.code}`,
    mode: RANKED,
  });
});

router.get('/checkname', (req, res) => {
  const name = req.user?.username || req.query.name;

  if (name === undefined) {
    return res.status(400).send({ message: 'No name provided' });
  }
  try {
    checkName(name);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }

  const { gameCode } = req.query;
  if (gameCode !== undefined) {
    const game = req.gm.retrieveGame(gameCode);
    if (game === undefined) {
      res.status(400).send({ message: 'Invalid game code' });
    } else {
      try {
        game.checkName(req, name);
        res.send({ mode: game.mode() });
      } catch (err) {
        res.status(400).send({ message: err.message });
      }
    }
  } else {
    res.send({});
  }
});

router.get('/checkcode', (req, res) => {
  const { gameCode } = req.query;
  const game = req.gm.retrieveGame(gameCode);
  if (game != undefined) {
    res.send({ mode: game.mode() });
  } else {
    res.status(400).send({ message: 'Invalid game code' });
  }
});

module.exports = router;
