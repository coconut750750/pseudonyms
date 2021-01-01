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
    if (name in this.players) {
      this.players[name].deactivate();
      if (this.allDeactivated()) {
        this.endGame();
      } else {
        this.notifyUpdate();
      }
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
      if (this.players[name].socket !== undefined) {
        this.players[name].socket.disconnect();
      }
      delete this.players[name];
      if (this.allDeactivated()) {
        this.endGame();
      } else {
        this.notifyUpdate();
      }
    }
  }

  resetTeams() {
    for (var p of Object.values(this.players)) {
      p.resetTeam();
    }
    this.notifyUpdate();
  }

  setTeam(name, isRed) {
    this.players[name].setTeam(isRed);
    this.notifyUpdate();
  }

  randomizeTeams() {
    const n = this.length();
    let nRed = Math.floor(n/2);
    let nBlue = Math.floor(n/2);
    if (n & 1 === 1) {
      const r = Math.floor(Math.random() * 2);
      nRed += (1 - r);
      nBlue += r;
    }

    for (var p of Object.values(this.players)) {
      if (nRed === 0) {
          p.setTeam(false);
      } else if (nBlue === 0) {
          p.setTeam(true);
      } else {
          const isRed = Math.random() > 0.5;
          p.setTeam(isRed);
          nRed -= isRed;
          nBlue -= (1 - isRed);
      }
    }

    this.notifyUpdate();
  }

  allAssignedTeam() {
    for (var p of Object.values(this.players)) {
      if (!p.assignedTeam()) {
        return false;
      }
    }
    return true;
  }

  teamCount(team) {
    let count = 0;
    for (var p of Object.values(this.players)) {
      if (p.isOnTeam(team)) {
        count += 1;
      }
    }
    return count
  }

  getNonSpectatorCount() {
    let count = 0;
    for (let p of Object.values(this.players)) {
      if (p.assignedTeam()) {
        count += 1;
      }
    }
    return count
  }
}

module.exports = PlayerList;