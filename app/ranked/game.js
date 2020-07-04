const ClassicGame = require("../classic/game");

const { completeGame } = require('../db/users');
const c = require('../common/const');
const { RANKED } = c;

class RankedGame extends ClassicGame {
  constructor(code, onEmpty, options, broadcast) {
    super(code, onEmpty, options, broadcast);
    this.usersCollection = options.usersCollection;
  }

  mode() {
    return RANKED;
  }

  checkName(req, name) {
    if (req.user === undefined) {
      throw new Error('Must be logged in');
    }
  }

  endGame(winner, matured) {
    super.endGame(winner, matured);

    this.plist.getAll().forEach(p => {
      completeGame(this.usersCollection, p.name, p.isOnTeam(winner), 100, 100);
    });
  }
}

module.exports = RankedGame;