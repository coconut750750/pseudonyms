const _ = require('lodash');
const mongoose = require('mongoose');

class PlayerList extends mongoose.Model{
  constructor() {
    super();
    this.players = new Map();
  }

  setup(endGame) {
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

  createPlayer(name, sid) {
    throw new Error('PlayerList.createPlayer() implemention required!');
  }

  add(name, sid) {
    this.players.set(name, this.createPlayer(name, sid));
  }

  activate(name, sid) {
    this.players.get(name).activate(sid);
  }

  deactivate(name) {
    if (this.players.has(name)) {
      this.players.get(name).deactivate();
      if (this.allDeactivated()) {
        this.endGame();
      } else {
        return true;
      }
    }
    return false;
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
        return true;
      }
    }
    return false;
  }

  resetTeams() {
    for (let [name, p] of this.players) {
      p.resetTeam();
    }
  }

  setTeam(name, isRed) {
    this.players.get(name).setTeam(isRed);
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