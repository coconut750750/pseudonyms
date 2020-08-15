const _ = require('lodash');
const mongoose = require('mongoose');

class PlayerList extends mongoose.Model{
  constructor() {
    super();
    this.players = new Map();
  }

  setup(PlayerClass, notifyUpdate, endGame) {
    this.PlayerClass = PlayerClass;
    this.notifyUpdate = notifyUpdate;
    this.endGame = endGame;
  }

  length() {
    return this.players.size;
  }

  getPlayer(name) {
    return this.players.get(name);
  }

  getAll() {
    return Array.from(this.players.values());
  }

  exists(name) {
    return this.players.has(name);
  }

  add(name, sid) {
    this.players.set(name, new this.PlayerClass(
      name,
      sid,
      this.length() === 0
    ));
    this.notifyUpdate();
  }

  activate(name, sid) {
    this.players.get(name).activate(sid);
    this.notifyUpdate();
  }

  deactivate(name) {
    if (this.players.has(name)) {
      this.players.get(name).deactivate();
      if (this.allDeactivated()) {
        this.endGame();
      } else {
        this.notifyUpdate();
      }
    }
  }

  allDeactivated() {
    for (let [name, p] of this.players) {
      if (p.active) { return false; }
    }
    return true;
  }

  isActive(name) {
    return this.players.get(name).active;
  }

  removePlayer(name, emitter) {
    if (this.players.has(name)) {
      this.players.get(name).send('end', {}, emitter);
      this.players.delete(name);
      if (this.allDeactivated()) {
        this.endGame();
      } else {
        this.notifyUpdate();
      }
    }
  }

  resetTeams() {
    for (let [name, p] of this.players) {
      p.resetTeam();
    }
    this.notifyUpdate();
  }

  setTeam(name, isRed) {
    this.players.get(name).setTeam(isRed);
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

    for (let [name, p] of this.players) {
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
    for (let [name, p] of this.players) {
      if (!p.assignedTeam()) {
        return false;
      }
    }
    return true;
  }

  teamCount(team) {
    let count = 0;
    for (let [name, p] of this.players) {
      if (p.isOnTeam(team)) {
        count += 1;
      }
    }
    return count
  }

  getNonSpectatorCount() {
    let count = 0;
    for (let [name, p] of this.players) {
      if (p.assignedTeam()) {
        count += 1;
      }
    }
    return count
  }
}

module.exports = PlayerList;