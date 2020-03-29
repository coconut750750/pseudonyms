var _ = require('lodash');

const Board = require("./board");
const KeyCard = require("./keycard");
const Player = require("./player");
const WordList = require("./wordlist");

class Game {
  constructor(code, onEnd, options) {
    this.code = code;
    this.players = [];
  }

  getPlayer(name) {
    return _.filter(this.players, p => p.name == name)[0];
  }

  playerExists(name) {
    return _.filter(this.players, p => p.name == name).length > 0;
  }

  addPlayer(name, socket) {
    this.players.push(new Player(
      name,
      socket,
      this.players.length === 0;
    ));
  }

  activatePlayer(name, socket) {
    this.getPlayer(name).activate(socket);
    this.notifyPlayerUpdate();
  }

  deactivatePlayer(name) {
    this.getPlayer(name).deactivate();
    this.notifyPlayerUpdate();
  }

  notifyPlayerUpdate() {
    this.players.forEach(player => player.send('players', { players: this.players.map(p => p.json()) }));
  }
}

module.exports = Game;