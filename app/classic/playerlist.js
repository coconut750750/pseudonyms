var _ = require('lodash');
const Player = require('./player');
const { RED, BLUE } = require('../common/const').classic;
const PlayerListInterface = require('../common/playerlist');

class PlayerList extends PlayerListInterface {
  constructor(notifyUpdate, endGame) {
    super(Player, notifyUpdate, endGame);
  }

  resetRoles() {
    for (var p of Object.values(this.players)) {
      p.resetRole();
    }
    this.notifyUpdate();
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

  randomizeCaptain(team) {
    const players = Object.values(this.players).filter(p => p.isOnTeam(team));
    const r = Math.floor(Math.random() * players.length);
    this.setCaptain(players[r].name);
  }

  setCaptain(name) {
    for (var p of Object.values(this.players)) {
      if (p.isOnTeam(this.players[name].team)) {
        p.resetRole();
      }
    }
    this.players[name].setCaptain();
    this.notifyUpdate();
  }

  enoughCaptains() {
    let hasRedCaptain = false;
    let hasBlueCaptain = false;

    for (var p of Object.values(this.players)) {
      hasRedCaptain = hasRedCaptain || (p.isOnTeam(RED) && p.isCaptain());
      hasBlueCaptain = hasBlueCaptain || (p.isOnTeam(BLUE) && p.isCaptain());
    }

    return hasRedCaptain && hasBlueCaptain
  }
}

module.exports = PlayerList;