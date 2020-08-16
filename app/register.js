const express = require("express");
const router = express.Router();

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 12;

const { CLASSIC, DUET } = require('./common/const');

router.post('/classic/create', async (req, res) => {
  const game = await req.gm.createClassicGame();
  
  res.send({
    gameCode: `${game.code}`,
    mode: CLASSIC,
  });
});

router.post('/duet/create', async (req, res) => {
  const game = await req.gm.createDuetGame();
  
  res.send({
    gameCode: `${game.code}`,
    mode: DUET,
  });
});

router.get('/checkname', async (req, res) => {
  const { name } = req.query;
  if (name === undefined) {
    return res.status(400).send({ message: 'No name provided' });
  }
  if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
    return res.status(400).send({ message: `Your name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters long` });
  }

  const { gameCode } = req.query;
  if (gameCode !== undefined) {
    const game = await req.gm.retrieveGameModel(gameCode);
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

router.get('/checkcode', async (req, res) => {
  const { gameCode } = req.query;
  const exists = await req.gm.gameExists(gameCode);
  if (exists) {
    res.send({});
  } else {
    res.status(400).send({ message: 'Invalid game code' });
  }
});

module.exports = router;
