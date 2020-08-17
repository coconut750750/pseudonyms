const { ClassicGameModel } = require('./classic/game');
const { DuetGameModel } = require('./duet/game');
const { GameModel } = require('./common/game');

class Manager {
  constructor(dev, io, statsCollection) {
    this.games = {};
    this.dev = dev;
    this.io = io;
    this.statsCollection = statsCollection;

    this.broadcast = (code) => (event, data) => io.to(code).emit(event, data);
    this.emitter = (id, event, data) => io.to(id).emit(event, data);
    this.reload = (game) => this.reloadGameModel(game);
    this.options = { statsCollection: this.statsCollection };

    if (dev) {
      this.devClassic();
      this.devDuet();
    }
  }

  async setupGame(newGame) {
    const code = await this.generateCode();
    newGame.setup(code, () => this.endGame(code), this.options, this.broadcast(code), this.emitter, this.reload);
    await newGame.save();
    this.games[code] = newGame;
  }

  async createClassicGame() {
    const newGame = new ClassicGameModel();
    await this.setupGame(newGame);
    return newGame;
  }

  async createDuetGame() {
    const newGame = new DuetGameModel();
    await this.setupGame(newGame);
    return newGame;
  }

  async gameExists(code) {
    return await GameModel.exists({ code });
  }

  async getGame(code) {
    let game = await GameModel.findOne({ code }).lean();
    if (game === null) {
      return undefined;
    }
    return game;
  }

  async retrieveGameModel(code) {
    let game = await GameModel.findOne({ code });
    if (game === null) {
      return undefined;
    }
    game.setupCallbacks(code, () => this.endGame(code), this.options, this.broadcast(code), this.emitter, this.reload);
    return game;
  }

  async reloadGameModel(game) {
    const updated = await this.getGame(game.code);
    Object.assign(game, updated);
    return updated !== undefined;
  }

  async endGame(code) {
    await GameModel.deleteOne({ code });
    delete this.games[code];
  }

  async generateCode() {
    var code = '';
    const length = 4;
    do {
      for (var i = 0; i < length; i++) {
        code += String.fromCharCode(97 + Math.random() * 26);
      }
    } while (await this.gameExists(code));
    return code;
  }

  devClassic() {
    const code = 'cccc';
    this.games[code] = new ClassicGameModel();
    this.games[code].setup(code, () => this.endGame(code), this.options, this.broadcast(code), this.emitter, this.reload);

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
    this.games[code].save();
  }

  devDuet() {
    const code = 'dddd';
    this.games[code] = new DuetGameModel();
    this.games[code].setup(code, () => this.endGame(code), this.options, this.broadcast(code), this.emitter, this.reload);

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
    this.games[code].save();
  }
}

module.exports = Manager;