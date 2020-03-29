var _ = require('lodash');

const Board = require("./board");
const KeyCard = require("./keycard");
const PlayerList = require("./playerlist");
const WordList = require("./wordlist");

const { MIN_PLAYERS } = require("./const");

const PHASES = ['lobby', 'teams', 'roles', 'board', 'result'];

class Game {
  constructor(code, onEnd, options, broadcast) {
    this.code = code;
    this.broadcast = broadcast;
    this.plist = PlayerList(
      () => this.notifyPlayerUpdate(),
      () => onEnd(),
    );
    this.started = false;
    this.phase = PHASES[0];

    this.keycard = new KeyCard();
    this.wordlist = new WordList('test');
    this.board = new Board(this.wordlist, (r, c) => this.notifyReveal(r, c));
  }

  getPlayer(name) {
    return this.plist.get(name);
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

  resetTeams() {
    this.plist.resetTeams();
  }

  setTeam(name, isRed) {
    this.plist.setTeam(name, isRed);
  }

  setKey(name) {
    this.plist.setKey(name);
  }

  enoughPlayers() {
    return this.plist.getAll().length >= MIN_PLAYERS;
  }

  start() {
    this.started = true;
    this.phase = PHASES[1];
    this.notifyGameStart();
  }

  confirmTeams() {
    this.phase = PHASES[2];
    this.notifyPhaseChange();
  }

  confirmRoles() {
    this.phase = PHASES[3];
    this.notifyPhaseChange();
  }

  getPlayerData() {
    const players = this.plist.getAll();
    const playerData = { players: players.map(p => p.json()) };
    return playerData;
  }

  notifyPlayerUpdate() {
    this.broadcast('players', this.getPlayerData());
  }

  notifyGameStart() {
    this.broadcast('start', {});
  }

  notifyPhaseChange() {
    this.broadcast('phase', { phase: this.phase });
  }

  notifyReveal(r, c) {
    const color = this.keycard.getTile(r, c);
    this.broadcast('reveal', { r, c, color });
  }
}

module.exports = Game;