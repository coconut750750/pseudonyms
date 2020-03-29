var _ = require('lodash');

const Board = require("./board");
const KeyCard = require("./keycard");
const PlayerList = require("./playerlist");
const WordList = require("./wordlist");

class Game {
  constructor(code, onEnd, options) {
    this.code = code;
    this.plist = PlayerList(
      () => this.notifyPlayerUpdate(),
      () => onEnd(),
    );
    this.started = false;
  }

  getPlayer(name) {
    return plist.get(name);
  }

  playerExists(name) {
    return this.plist.exists(name);
  }

  addPlayer(name, socket) {
    this.plist.add(name, socket);
  }

  activatePlayer(name, socket) {
    this.plist.activate(name, socket);
  }

  deactivatePlayer(name) {
    this.plist.deactivate(name);
  }

  isActive(name) {
    return this.plist.isActive(name);
  }

  removePlayer(name) {
    this.plist.remove(name);
  }

  setTeams(redNames) {
    this.plist.setTeams(redNames);
  }

  setKey(name) {
    this.plist.setKey(name);
  }

  notifyPlayerUpdate() {
    const players = this.plist.getAll();
    const playerData = { players: players.map(p => p.json()) };
    players.forEach(p => p.send('players', playerData));
  }
}

module.exports = Game;