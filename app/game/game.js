const Game = require("../game")
const Board = require("./board");
const KeyCard = require("./keycard");
const PlayerList = require("./playerlist");
const WordList = require("./wordlist");

const { RED, BLUE, MIN_PLAYERS } = require("./const");

const PHASES = ['lobby', 'teams', 'roles', 'board', 'result'];

class PseudoGame extends Game {
  constructor(code, onEmpty, options, broadcast) {
    super(code, onEmpty, options, broadcast);
    this.plist = PlayerList(
      () => this.notifyPlayerUpdate(),
      () => onEmpty(),
    );

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
    return this.phase === PHASES[1];
  }

  setTeam(name, isRed) {
    this.plist.setTeam(name, isRed);
  }

  randomizeTeams() {
    this.plist.randomizeTeams();
  }

  canSetRole() {
    return this.phase === PHASES[2];
  }

  setKey(name) {
    this.plist.setKey(name);
  }

  enoughPlayers() {
    return this.plist.getAll().length >= MIN_PLAYERS;
  }

  canStart() {
    return this.phase === PHASES[0];
  }

  hasStarted() {
    return this.started;
  }

  start(options) {
    const { wordlist, customWords } = options;
    this.wordlist = new WordList(wordlist, customWords);

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
    this.notifyScore();
    this.notifyPhaseChange();
  }

  canSendClue(player) {
    if (this.turn !== player.team) {
      return false;
    }
    if (!player.isKey()) {
      return false;
    }
    if (this.phase !== PHASES[3]) {
      return false;
    }
    return true;
  }

  validClue(clue) {
    return this.board.validWord(clue.toLowerCase());
  }

  sendClue(clue, count) {
    this.clue = { clue, count };
    this.notifyClue();
  }

  isActivePlayer(player) {
    return this.turn === player.team && !player.isKey();
  }

  reveal(r, c) {
    if (this.board.isRevealed(r, c)) {
      return;
    }

    this.board.reveal(r, c);
    this.keycard.reveal(r, c);
    this.notifyScore();

    if (this.keycard.isBlack(r, c)) {
      this.endGame(this.turn === RED ? BLUE : RED);
      return;
    }

    const winner = this.keycard.checkWin();
    if (winner !== undefined) {
      this.endGame(winner);
      return;
    }

    if (this.keycard.isWhite(r, c)) {
      this.endTurn();
    } else if (this.keycard.isRed(r, c) && this.turn !== RED) {
      this.endTurn();
    } else if (this.keycard.isBlue(r, c) && this.turn !== BLUE) {
      this.endTurn();
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

  endTurn() {
    this.clue = undefined;
    this.turn = this.turn === RED ? BLUE : RED;
    this.notifyTurnChange();
  }

  endGame(winner) {
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

  broadcast(event, data) {
    this.broadcast(event, data);
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

  notifyScore() {
    this.broadcast('score', { red: this.keycard.redLeft, blue: this.keycard.blueLeft });
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

  connectSendScore(player) {
    if (this.keycard !== undefined && (this.phase === PHASES[3] || this.phase === PHASES[4])) {
      player.send('score', { red: this.keycard.redLeft, blue: this.keycard.blueLeft });
    }
  }

  connectSendWinner(player) {
    if (this.phase === 'result' && this.winner !== undefined) {
      player.send('winner', { winner: this.winner });
    }
  }

  delete() {
    this.broadcast('end', {});
    this.onEmpty();
  }
}

module.exports = PseudoGame;