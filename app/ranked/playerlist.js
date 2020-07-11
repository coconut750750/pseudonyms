const Player = require('./player');
const ClassicPlayerList = require('../classic/playerlist');

class PlayerList extends ClassicPlayerList {
  constructor(notifyUpdate, endGame) {
    super(notifyUpdate, endGame, Player);
    this.collection = undefined;
  }

  setCollection(collection) {
    this.collection = collection;
  }

  add(name, socket) {
    this.silent_add(name, socket);
    this.players[name].loadProfile(this.collection).then(() => this.notifyUpdate());
  }
}

module.exports = PlayerList;