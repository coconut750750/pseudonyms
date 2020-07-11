var _ = require('lodash');
const Player = require('./player');
const PlayerListInterface = require('../common/playerlist');

class PlayerList extends PlayerListInterface {
  constructor(notifyUpdate, endGame) {
    super(notifyUpdate, endGame, Player);
  }
}

module.exports = PlayerList;