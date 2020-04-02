const PseudoGame = require('./game/game');

class Manager {
  constructor() {
    this.games = {};
  }

  createGame(options, broadcast) {
    const code = this.generateCode();
    const newGame = new PseudoGame(code, () => this.endGame(code), options, (event, data) => broadcast(code, event, data));
    this.games[code] = newGame;
    return newGame;
  }

  retrieveGame(code) {
    return this.games[code];
  }

  endGame(code) {
    delete this.games[code];
  }

  generateCode() {
    var code = '';
    const length = 4;
    do {
      for (var i = 0; i < length; i++) {
        code += String.fromCharCode(97 + Math.random() * 26);
      }
    } while (this.games[code]);
    return code;
  }
}

module.exports = Manager;