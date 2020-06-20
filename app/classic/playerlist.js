var _ = require('lodash');
const Player = require('./player');
const { RED, BLUE } = require('../common/const').classic;
const PlayerListInterface = require('../common/playerlist');

class PlayerList extends PlayerListInterface {
  constructor(notifyUpdate, endGame) {
    super(Player, notifyUpdate, endGame);
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

  resetRoles() {
    for (var p of Object.values(this.players)) {
      p.resetRole();
    }
    this.notifyUpdate();
  }

  setKey(name) {
    for (var p of Object.values(this.players)) {
      if (p.isOnTeam(this.players[name].team)) {
        p.resetRole();
      }
    }
    this.players[name].setKey();
    this.notifyUpdate();
  }

  enoughKeys() {
    let hasRedKey = false;
    let hasBlueKey = false;

    for (var p of Object.values(this.players)) {
      hasRedKey = hasRedKey || (p.isOnTeam(RED) && p.isKey());
      hasBlueKey = hasBlueKey || (p.isOnTeam(BLUE) && p.isKey());
    }

    return hasRedKey && hasBlueKey
  }
}

module.exports = PlayerList;