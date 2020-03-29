var _ = require('lodash');

const Board = require("./board");
const KeyCard = require("./keycard");
const PlayerList = require("./playerlist");
const WordList = require("./wordlist");

const { MIN_PLAYERS } = require("./const");

const PHASES = ['lobby', 'teams', 'roles', 'board', 'result'];

class Game {
  constructor(code, onEmpty, options, broadcast) {
    this.code = code;
    this.plist = PlayerList(
      () => this.notifyPlayerUpdate(),
      () => onEmpty(),
    );
    this.started = false;
    this.phase = PHASES[0];

    this.keycard = undefined;
    this.wordlist = undefined;
    this.board = undefined;

    this.broadcast = broadcast;
    this.broadcastKeys = (event, data) => {
      this.plist.getAll().forEach(p => p.sendAsKey(event, data));
    }
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

  randomizeTeams() {
    this.plist.randomizeTeams();
  }

  setKey(name) {
    this.plist.setKey(name);
  }

  enoughPlayers() {
    return this.plist.getAll().length >= MIN_PLAYERS;
  }

  start(options) {
    this.keycard = new KeyCard();
    this.wordlist = new WordList(options.wordlist);
    this.board = new Board(this.wordlist, (r, c) => this.notifyReveal(r, c));

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
    this.notifyBoardChange();
    this.notifyKeyChange();
    this.notifyPhaseChange();
  }

  reveal(r, c) {
    this.board.reveal(r, c);
    if (this.keycard.isBlack(r, c)) {
      this.end();
    }
  }

  end() {
    this.phase = PHASES[4];
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

  notifyBoardChange() {
    this.broadcast('board', this.board.json());
  }

  notifyKeyChange() {
    this.broadcastKeys('key', this.keycard.json());
  }

  notifyReveal(r, c) {
    const color = this.keycard.getTile(r, c);
    this.broadcast('reveal', { r, c, color });
  }
}

module.exports = Game;