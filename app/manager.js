const ClassicGame = require('./classic/game');
const DuetGame = require('./duet/game');

class Manager {
  constructor(dev, io, statsCollection) {
    this.games = {};
    this.dev = dev;
    this.io = io;
    this.statsCollection = statsCollection;

    this.broadcast = (code) => (event, data) => io.to(code).emit(event, data);
    this.emitter = (id, event, data) => io.to(id).emit(event, data);
    this.options = { statsCollection: this.statsCollection };

    if (dev) {
      this.devClassic();
      this.devDuet();
    }
  }

  createClassicGame() {
    const code = this.generateCode();
    const newGame = new ClassicGame(code, () => this.endGame(code), this.options, this.broadcast(code), this.emitter);
    this.games[code] = newGame;
    return newGame;
  }

  createDuetGame() {
    const code = this.generateCode();
    const newGame = new DuetGame(code, () => this.endGame(code), this.options, this.broadcast(code), this.emitter);
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

  devClassic() {
    const code = 'cccc';
    this.games[code] = new ClassicGame(code, () => this.endGame(code), this.options, this.broadcast(code), this.emitter);

    for (let name of ['11', '22', '33', '44', '55']) {
      this.games[code].addPlayer(name, undefined);
    }
    this.games[code].start({ clueLimit: 0, guessLimit: 0, wordlist: 'classic' })
    this.games[code].setTeam('11', true)
    this.games[code].setTeam('22', true)
    this.games[code].setTeam('33', false)
    this.games[code].setTeam('44', false)
    this.games[code].setTeam('55', false)
    this.games[code].confirmTeams();
    this.games[code].setCaptain(this.games[code].getPlayer('11'));
    this.games[code].setCaptain(this.games[code].getPlayer('33'));
    this.games[code].confirmRoles();

    for (let name of ['11', '22', '33', '44']) {
      this.games[code].deactivatePlayer(name);
    }
  }

  devDuet() {
    const code = 'dddd';
    this.games[code] = new DuetGame(code, () => this.endGame(code), this.options, this.broadcast(code), this.emitter);

    for (let name of ['11', '22', '33']) {
      this.games[code].addPlayer(name, undefined);
    }
    this.games[code].start({ clueLimit: 0, guessLimit: 0, wordlist: 'classic', timers: 9, mistakes: 9 })
    this.games[code].setTeam('11', true)
    this.games[code].setTeam('22', false)
    this.games[code].setTeam('33', false)
    this.games[code].confirmTeams();

    this.games[code].deactivatePlayer('11');
    this.games[code].deactivatePlayer('22');
  }
}

module.exports = Manager;