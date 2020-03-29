const express = require("express");
const router = express.Router();

router.post('/create', (req, res) => {
  const game = req.pseudo.createGame(req.body, (code, event, data) => req.io.to(code).emit(event, data));
  
  res.send({
    gameCode: `${game.code}`
  });
});

router.get('/checkname', (req, res) => {
  const { name } = req.query;
  if (name.length < 2 || name.length > 12) {
    res.send({ valid: false, message: 'Your name must be between 2 and 12 characters long' });
    return;
  }

  const { gameCode } = req.query;
  if (gameCode != undefined) {
    const game = req.pseudo.retrieveGame(gameCode);
    if (game.playerExists(name) && !game.isActive(name)) {
      res.send({ valid: true });
      return;
    } else if (game.playerExists(name)) {
      res.send({ valid: false, message: 'This name has been taken' });
      return;
    }
    if (game.started) {
      res.send({ valid: false, message: 'This game is closed' });
      return;
    }
  }

  res.send({ valid: true });
});

router.get('/checkcode', (req, res) => {
  const { gameCode } = req.query;
  const game = req.pseudo.retrieveGame(gameCode);
  if (game != undefined) {
    res.send({ valid: true });
  } else {
    res.send({ valid: false, message: 'This game code is invalid' });
  }
});

module.exports = router;
