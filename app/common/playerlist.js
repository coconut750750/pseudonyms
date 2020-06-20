var _ = require('lodash');

class PlayerList {
  constructor(PlayerClass, notifyUpdate, endGame) {
    this.PlayerClass = PlayerClass;
    this.notifyUpdate = notifyUpdate;
    this.endGame = endGame;
    this.players = {};
  }

  length() {
    return Object.keys(this.players).length;
  }

  get(name) {
    return this.players[name];
  }

  getAll() {
    return Object.values(this.players);
  }

  exists(name) {
    return name in this.players;
  }

  add(name, socket) {
    this.players[name] = new this.PlayerClass(
      name,
      socket,
      this.length() === 0
    );
    this.notifyUpdate();
  }

  activate(name, socket) {
    this.players[name].activate(socket);
    this.notifyUpdate();
  }

  deactivate(name) {
    this.players[name].deactivate();
    if (this.allDeactivated()) {
      this.endGame();
    } else {
      this.notifyUpdate();
    }
  }

  allDeactivated() {
    for (var p of Object.values(this.players)) {
      if (p.active) { return false; }
    }
    return true;
  }

  isActive(name) {
    return this.players[name].active;
  }

  remove(name) {
    if (name in this.players) {
      this.players[name].send('end', {});
      delete this.players[name];
    }
    if (this.allDeactivated()) {
      this.endGame();
    } else {
      this.notifyUpdate();
    }
  }
}

module.exports = PlayerList;