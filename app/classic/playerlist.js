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