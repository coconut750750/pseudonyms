const express = require("express");
const router = express.Router();

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 16;

const { CLASSIC, DUET } = require('./common/const');

router.post('/classic/create', (req, res) => {
  const game = req.gm.createClassicGame();
  
  res.send({
    gameCode: `${game.code}`,
    mode: CLASSIC,
  });
});

router.post('/duet/create', (req, res) => {
  const game = req.gm.createDuetGame();
  
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
  if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
    return res.status(400).send({ message: `Your name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters long` });
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
