const { ClassicGameModel } = require('./classic/game');
const { DuetGameModel } = require('./duet/game');
const { GameModel } = require('./common/game');

class Manager {
  constructor(dev, io, statsCollection) {
    // this.games = {};
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
    // this.games[code] = newGame;
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
    // delete this.games[code];
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
    const game = new ClassicGameModel();
    game.setup(code, () => this.endGame(code), this.options, this.broadcast(code), this.emitter, this.reload);

    for (let name of ['11', '22', '33', '44', '55']) {
      game.addPlayer(name, undefined);
    }
    game.start({ clueLimit: 0, guessLimit: 0, wordlist: 'classic' })
    game.setTeam('11', true)
    game.setTeam('22', true)
    game.setTeam('33', false)
    game.setTeam('44', false)
    game.setTeam('55', false)
    game.confirmTeams();
    game.setCaptain(game.getPlayer('11'));
    game.setCaptain(game.getPlayer('33'));
    game.confirmRoles();

    for (let name of ['11', '22', '33', '44']) {
      game.deactivatePlayer(name);
    }
    game.save();
  }

  devDuet() {
    const code = 'dddd';
    const game = new DuetGameModel();
    game.setup(code, () => this.endGame(code), this.options, this.broadcast(code), this.emitter, this.reload);

    for (let name of ['11', '22', '33']) {
      game.addPlayer(name, undefined);
    }
    game.start({ clueLimit: 0, guessLimit: 0, wordlist: 'classic', timers: 9, mistakes: 9 })
    game.setTeam('11', true)
    game.setTeam('22', false)
    game.setTeam('33', false)
    game.confirmTeams();

    game.deactivatePlayer('11');
    game.deactivatePlayer('22');
    game.save();
  }
}

module.exports = Manager;