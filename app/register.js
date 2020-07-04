const express = require("express");
const router = express.Router();

const { checkName } = require('./utils');
const { CLASSIC, DUET } = require('./common/const');

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

router.get('/checkname', (req, res) => {
  const { name } = req.query;
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
    } else if (game.playerExists(name) && !game.isActive(name)) {
      res.send({ mode: game.mode() });
    } else if (game.playerExists(name)) {
      res.status(400).send({ message: 'This name has been taken' });
    } else {
      res.send({ mode: game.mode() });
    }
  } else {
    res.send({});
  }
});

router.get('/checkcode', (req, res) => {
  const { gameCode } = req.query;
  const game = req.gm.retrieveGame(gameCode);
  if (game != undefined) {
    res.send({});
  } else {
    res.status(400).send({ message: 'Invalid game code' });
  }
});

module.exports = router;
