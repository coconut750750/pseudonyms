var _ = require('lodash');

const Board = require("./board");
const KeyCard = require("./keycard");
const PlayerList = require("./playerlist");
const WordList = require("./wordlist");

const { RED, BLUE, MIN_PLAYERS } = require("./const");

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
    this.clues = undefined;
    this.turn = undefined;

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
    this.turn = this.keycard.start;
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
    this.notifyKeyChange();
    this.notifyBoardChange();
    this.notifyPhaseChange();
  }

  reveal(r, c) {
    if (this.board.isRevealed(r, c)) {
      return;
    }

    this.board.reveal(r, c);
    this.keycard.reveal(r, c);

    if (this.keycard.isBlack(r, c)) {
      this.end(this.turn === RED ? BLUE : RED);
    }

    const winner = this.keycard.checkWin();
    if (winner !== undefined) {
      this.end(winner);
    }
  }

  sendClue(clue, count) {
    this.notifyClue(clue, count);
  }

  endTurn() {
    this.turn = this.turn === RED ? BLUE : RED;
    this.notifyTurnChange();
  }

  end(winner) {
    this.phase = PHASES[4];
    this.notifyPhaseChange();
    this.notifyWinner(winner);
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
    this.broadcast('start', { first: this.keycard.start });
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

  notifyTurnChange() {
    this.broadcast('turn', { turn: this.turn });
  }

  notifyClue(clue, count) {
    this.broadcast('clue', { clue, count });
  }

  notifyReveal(r, c) {
    const color = this.keycard.getTile(r, c);
    this.broadcast('reveal', { r, c, color });
  }

  notifyWinner(winner) {
    this.broadcast('winner', { winner });
  }
}

module.exports = Game;