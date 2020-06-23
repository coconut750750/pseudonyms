const express = require("express");
const router = express.Router();

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 12;

const { CLASSIC, DUET } = require('./common/const');

router.post('/classic/create', (req, res) => {
  let options = req.body;
  options.dbCollection = req.dbCollection;
  const game = req.gm.createClassicGame(req.body, (code, event, data) => req.io.to(code).emit(event, data));
  
  res.send({
    gameCode: `${game.code}`,
    mode: CLASSIC,
  });
});

router.post('/duet/create', (req, res) => {
  let options = req.body;
  options.dbCollection = req.dbCollection;
  const game = req.gm.createDuetGame(req.body, (code, event, data) => req.io.to(code).emit(event, data));
  
  res.send({
    gameCode: `${game.code}`,
    mode: DUET,
  });
});

router.get('/checkname', (req, res) => {
  const { name } = req.query;
  if (name === undefined) {
    res.send({ valid: false, message: 'No name provided' });
    return;
  }
  if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
    res.send({ valid: false, message: `Your name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters long` });
    return;
  }

  const { gameCode } = req.query;
  if (gameCode !== undefined) {
    const game = req.gm.retrieveGame(gameCode);
    if (game === undefined) {
      res.send({ valid: false, message: 'Invalid game code' });
    } else if (game.playerExists(name) && !game.isActive(name)) {
      res.send({
        valid: true,
        mode: game.mode(),
      });
    } else if (game.playerExists(name)) {
      res.send({ valid: false, message: 'This name has been taken' });
    } else if (game.hasStarted()) {
      res.send({ valid: false, message: 'This game is closed' });
    } else {
      res.send({
        valid: true,
        mode: game.mode(),
      });
    }
  } else {
    res.send({ valid: true });
  }
});

router.get('/checkcode', (req, res) => {
  const { gameCode } = req.query;
  const game = req.gm.retrieveGame(gameCode);
  if (game != undefined) {
    res.send({ valid: true });
  } else {
    res.send({ valid: false, message: 'Invalid game code' });
  }
});

module.exports = router;
