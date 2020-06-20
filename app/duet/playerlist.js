var _ = require('lodash');
const Player = require('./player');
const PlayerListInterface = require('../common/playerlist');

class PlayerList extends PlayerListInterface {
  constructor(notifyUpdate, endGame) {
    super(Player, notifyUpdate, endGame);
  }
}

module.exports = PlayerList;