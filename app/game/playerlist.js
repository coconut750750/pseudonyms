var _ = require('lodash');
const Player = require('./player');
const { RED, BLUE } = require('./const');

class PlayerList {
  constructor(notifyUpdate, endGame) {
    this.notifyUpdate = notifyUpdate;
    this.endGame = endGame;
    this.players = [];
  }

  get(name) {
    return _.filter(this.players, p => p.name == name)[0];
  }

  getAll() {
    return this.players;
  }

  exists(name) {
    return _.filter(this.players, p => p.name == name).length > 0;
  }

  add(name, socket) {
    this.players.push(new Player(
      name,
      socket,
      this.players.length === 0
    ));
    this.notifyUpdate();
  }

  activate(name, socket) {
    this.get(name).activate(socket);
    this.notifyUpdate();
  }

  deactivate(name) {
    this.get(name).deactivate();
    if (this.allDeactivated()) {
      this.endGame();
    } else {
      this.notifyUpdate();
    }
  }

  allDeactivated() {
    for (var p of this.players) {
      if (p.active) { return false; }
    }
    return true;
  }

  isActive(name) {
    return this.get(name).active;
  }

  remove(name) {
    const removedPlayers = _.remove(this.players, p => p.name == name);
    if (removedPlayers.length > 0) {
      removedPlayers[0].send('end', {});
    }
    if (this.allDeactivated()) {
      this.endGame();
    } else {
      this.notifyUpdate();
    }
  }

  resetTeams() {
    for (var p of this.players) {
      p.resetTeam();
    }
    this.notifyUpdate();
  }

  setTeam(name, isRed) {
    this.get(name).setTeam(isRed);
    this.notifyUpdate();
  }

  randomizeTeams() {
    const n = this.players.length;
    let nRed = Math.floor(n/2);
    let nBlue = Math.floor(n/2);
    if (n & 1 === 1) {
      const r = Math.floor(Math.random() * 2);
      nRed += (1 - r);
      nBlue += r;
    }

    for (var p of this.players) {
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
    for (var p of this.players) {
      if (!p.assignedTeam()) {
        return false;
      }
    }
    return true;
  }

  resetRoles() {
    for (var p of this.players) {
      p.resetRole();
    }
    this.notifyUpdate();
  }

  setKey(name) {
    for (var p of this.players) {
      if (p.isOnTeam(this.get(name).team)) {
        p.resetRole();
      }
    }
    this.get(name).setKey();
    this.notifyUpdate();
  }

  enoughKeys() {
    let hasRedKey = false;
    let hasBlueKey = false;

    for (var p of this.players) {
      hasRedKey = hasRedKey || (p.isOnTeam(RED) && p.isKey());
      hasBlueKey = hasBlueKey || (p.isOnTeam(BLUE) && p.isKey());
    }

    return hasRedKey && hasBlueKey
  }
}

module.exports = PlayerList;