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

    this.broadcast = broadcast;
    this.broadcastKeys = (event, data) => {
      this.plist.getAll().forEach(p => p.sendAsKey(event, data));
    }

    this.reset();
  }

  reset() {
    this.started = false;
    this.phase = PHASES[0];
    this.keycard = undefined;
    this.wordlist = undefined;
    this.board = undefined;
    this.clue = undefined;
    this.turn = undefined;
    this.winner = undefined;

    this.notifyPhaseChange();

    this.plist.resetTeams();
    this.plist.resetRoles();
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

  canSetTeam() {
    return this.phase === PHASE[1];
  }

  setTeam(name, isRed) {
    this.plist.setTeam(name, isRed);
  }

  randomizeTeams() {
    this.plist.randomizeTeams();
  }

  canSetRole() {
    return this.phase === PHASE[2];
  }

  setKey(name) {
    this.plist.setKey(name);
  }

  enoughPlayers() {
    return this.plist.getAll().length >= MIN_PLAYERS;
  }

  start(options) {
    this.wordlist = new WordList(options.wordlist);
    this.started = true;
    this.phase = PHASES[1];
    this.notifyPhaseChange();
  }

  confirmTeams() {
    this.phase = PHASES[2];
    this.notifyPhaseChange();
  }

  confirmRoles() {
    this.phase = PHASES[3];

    this.keycard = new KeyCard();
    this.turn = this.keycard.start;
    this.board = new Board(this.wordlist, (r, c) => this.notifyReveal(r, c));

    this.notifyKeyChange();
    this.notifyBoardChange();
    this.notifyTurnChange();
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

  getRevealsData() {
    let data = [];
    for (var rev of this.board.revealed) {
      const [r, c] = rev;
      data.push({ r, c, color: this.keycard.getTile(r, c) });
    }
    return data;
  }

  sendClue(clue, count) {
    this.clue = { clue, count };
    this.notifyClue();
  }

  endTurn() {
    this.clue = undefined;
    this.turn = this.turn === RED ? BLUE : RED;
    this.notifyTurnChange();
  }

  end(winner) {
    this.winner = winner;
    this.started = false;
    this.phase = PHASES[4];
    this.notifyWinner();
    this.notifyFinalReveal();
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

  notifyClue() {
    this.broadcast('clue', this.clue);
  }

  notifyReveal(r, c) {
    const color = this.keycard.getTile(r, c);
    this.broadcast('reveal', { reveal: [{ r, c, color }] });
  }

  notifyWinner() {
    this.broadcast('winner', { winner: this.winner });
  }

  notifyFinalReveal() {
    this.broadcast('key', this.keycard.json());
  }

  // send data for disconnected users
  connectSendBoard(player) {
    if (this.board !== undefined) {
      player.send('board', this.board.json());
      player.send('reveal', { reveal: this.getRevealsData() });
    }
  }

  connectSendKey(player) {
    if (this.keycard === undefined) {
      return;
    }
    if (this.phase === PHASES[4] || player.isKey()) {
      player.send('key', this.keycard.json());
    }
  }

  connectSendTurn(player) {
    if (this.turn !== undefined) {
      player.send('turn', { turn: this.turn });
    }
  }

  connectSendClue(player) {
    if (this.clue !== undefined) {
      player.send('clue', this.clue);
    }
  }

  connectSendWinner(player) {
    if (this.phase === 'result' && this.winner !== undefined) {
      player.send('winner', { winner: this.winner });
    }
  }
}

module.exports = Game;