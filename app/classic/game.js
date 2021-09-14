const GameInterface = require("../common/game")
const Clues = require("../common/clues");
const WordList = require("../common/wordlist");
const { GameError } = require("../common/gameerror");

const socketio = require("./socketio");
const Board = require("./board");
const KeyCard = require("./keycard");
const PlayerList = require("./playerlist");
const GameOptions = require("./gameoptions");
const { incrementGameStarts, saveGame, GameStats } = require("./analytics");

const c = require('../common/const');
const { CLASSIC } = c;
const { RED, BLUE, MIN_PLAYERS } = c.classic;

const LOBBY = 'lobby';
const TEAMS = 'teams';
const ROLES = 'roles';
const BOARD = 'board';
const RESULT = 'result';

class ClassicGame extends GameInterface {
  constructor(code, onEmpty, options, broadcast) {
    super(code, onEmpty, options, broadcast, PlayerList, MIN_PLAYERS);

    this.clues = new Clues( () => this.notifyClue() );

    this.broadcastCaptains = (event, data) => {
      this.plist.getAll().forEach(p => p.sendAsCaptain(event, data));
    }

    this.reset();
  }

  mode() {
    return CLASSIC;
  }

  canRemove(name) {
    return (this.phase === BOARD || this.phase === RESULT) && !this.plist.get(name).assignedTeam();
  }

  socketio(socket, game, name, player) {
    super.socketio(socket, game, name, player);
    socketio(socket, game, name, player);
  }

  reset() {
    super.reset();
    
    this.started = false;
    this.gameoptions = undefined;
    this.phase = LOBBY;
    this.keycard = undefined;
    this.wordlist = undefined;
    this.board = undefined;
    this.turn = undefined;
    this.guessesLeft = 0;
    this.winner = undefined;
    this.clues.clear();
    this.gameStats = new GameStats();

    this.notifyPhaseChange();

    this.plist.resetTeams();
    this.plist.resetRoles();
  }

  canReset() {
    return this.phase !== BOARD;
  }

  canSetTeam() {
    return this.phase === TEAMS;
  }

  canSetRole(player) {
    return this.phase === ROLES && player.assignedTeam();
  }

  setCaptain(player) {
    if (this.canSetRole(player)) {
      this.plist.setCaptain(player.name);
    }
  }

  randomizeRoles(player) {
    if (this.canSetRole(player)) {
      this.plist.randomizeCaptain(player.team);
    }
  }

  canStart() {
    return this.phase === LOBBY;
  }

  hasStarted() {
    return this.started;
  }

  start(options) {
    if (!this.enoughPlayers()) {
      throw new GameError(`At least ${MIN_PLAYERS} players required to start`);
    }
    
    this.gameoptions = new GameOptions(options);
    this.wordlist = new WordList(this.gameoptions.wordlist, this.gameoptions.customWords);

    this.started = true;
    this.phase = TEAMS;
    this.notifyPhaseChange();
  }

  validTeamCount() {
    return this.plist.teamCount(RED) >= 2 && this.plist.teamCount(BLUE) >= 2;
  }

  confirmTeams() {
    super.confirmTeams();
    if (this.phase !== TEAMS) {
      return;
    }
    if (!this.validTeamCount()) {
      throw new GameError("At least 2 players must be on each team");
    }
    this.phase = ROLES;
    this.notifyPhaseChange();
  }

  enoughCaptains() {
    return this.plist.enoughCaptains();
  }

  confirmRoles() {
    if (this.phase !== ROLES) {
      return;
    }
    if (!this.enoughCaptains()) {
      throw new GameError("Not enough Captains");
    }
    this.phase = BOARD;

    this.keycard = new KeyCard();
    this.turn = this.keycard.start;
    this.board = new Board(this.wordlist, (r, c) => this.notifyReveal(r, c));
    this.gameStats.startGame(this.turn);

    this.notifyKeyChange();
    this.notifyBoardChange();
    this.notifyTurnChange();
    this.notifyScore();
    this.notifyPhaseChange();
    incrementGameStarts(this.options.statsCollection);

    this.startClue();
  }

  startClue() {
    this.stopTimer();
    this.startTimer(this.gameoptions.clueLimit, () => this.addClue(undefined, "-", "-"));
  }

  startGuess() {
    this.stopTimer();
    this.startTimer(this.gameoptions.guessLimit, () => this.endTurn());
  }

  canSendClue(player) {
    if (this.phase !== BOARD) {
      return false;
    }
    return player.assignedTeam() && player.isOnTeam(this.turn) && player.isCaptain();
  }

  validClue(word) {
    return this.board.validWord(word.toLowerCase());
  }

  addClue(player, word, count) {
    if (!this.validClue(word)) {
      throw new GameError("Invalid Clue");
    }
    if (this.clues.currentExists()) {
      return false;
    }
    this.clues.add(word, count, this.turn);
    this.gameStats.addClue();
    this.guessesLeft = parseInt(count) + 1;
    this.notifyGuessesLeft();
    this.startGuess();
  }

  canReveal(player) {
    return this.clues.currentExists() && player.assignedTeam() && player.isOnTeam(this.turn) && !player.isCaptain() && this.phase === BOARD;
  }

  canEndTurn(player) {
    return this.canReveal(player);
  }

  reveal(r, c) {
    if (!this.board.validTile(r, c)) {
      return;
    }
    if (this.board.isRevealed(r, c)) {
      return;
    }

    this.board.reveal(r, c);
    this.keycard.reveal(r, c);
    this.guessesLeft -= 1;
    this.notifyScore();

    if (this.keycard.isBlack(r, c)) {
      this.endGame(this.turn === RED ? BLUE : RED, false);
      return;
    }

    const winner = this.keycard.checkWin();
    if (winner !== undefined) {
      this.endGame(winner, true);
      return;
    }

    if (this.keycard.isWhite(r, c)) {
      this.endTurn();
    } else if (this.keycard.isRed(r, c) && this.turn !== RED) {
      this.endTurn();
    } else if (this.keycard.isBlue(r, c) && this.turn !== BLUE) {
      this.endTurn();
    } else if (this.guessesLeft == 0) {
      this.endTurn();
    } else {
      this.notifyGuessesLeft();
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
    this.clues.resetCurrent();
    this.turn = this.turn === RED ? BLUE : RED;
    this.notifyTurnChange();
    this.startClue();

    this.gameStats.addTurn(this.keycard.redLeft, this.keycard.blueLeft);
  }

  endGame(winner, matured) {
    this.stopTimer();
    this.winner = winner;
    this.phase = RESULT;
    
    this.gameStats.addTurn(this.keycard.redLeft, this.keycard.blueLeft);
    this.gameStats.endGame(matured, this.winner);
    saveGame(this.options.statsCollection, this.plist.getNonSpectatorCount(), this.gameoptions.wordlist, this.gameStats);
    
    this.notifyWinner();
    this.notifyFinalReveal();
    this.notifyGameStats();
    this.notifyPhaseChange();
  }

  notifyPhaseChange() {
    this.broadcast('phase', { phase: this.phase });
  }

  notifyBoardChange() {
    this.broadcast('board', this.board.json());
  }

  notifyKeyChange() {
    this.broadcastCaptains('key', this.keycard.json());
  }

  notifyTurnChange() {
    this.broadcast('turn', { turn: this.turn });
  }

  notifyClue() {
    this.broadcast('clues', this.clues.json());
  }

  notifyScore() {
    this.broadcast('score', { red: this.keycard.redLeft, blue: this.keycard.blueLeft });
  }

  notifyReveal(r, c) {
    const color = this.keycard.getTile(r, c);
    this.broadcast('reveal', { reveal: [{ r, c, color }] });
  }

  notifyGuessesLeft() {
    if (!Number.isNaN(this.guessesLeft)) {
      this.broadcast('guesses', { guesses: this.guessesLeft });
    }
  }

  notifyWinner() {
    this.broadcast('winner', { winner: this.winner });
  }

  notifyFinalReveal() {
    this.broadcast('key', this.keycard.json());
  }

  notifyGameStats() {
    this.broadcast('stats', { stats: this.gameStats });
  }

  // send data for disconnected users
  reconnectSendBoard(player) {
    if (this.board !== undefined) {
      player.send('board', this.board.json());
      player.send('reveal', { reveal: this.getRevealsData() });
    }
  }

  reconnectSendKey(player) {
    if (this.keycard === undefined) {
      return;
    }
    if (this.phase === RESULT || player.isCaptain()) {
      player.send('key', this.keycard.json());
    }
  }

  reconnectSendTurn(player) {
    if (this.turn !== undefined) {
      player.send('turn', { turn: this.turn });
    }
  }

  reconnectSendClue(player) {
    player.send('clues', this.clues.json());
  }

  reconnectSendGuessesLeft(player) {
    if (this.clues.currentExists()) {
      player.send('guesses', { guesses: this.guessesLeft });
    }
  }

  reconnectSendScore(player) {
    if (this.keycard !== undefined && (this.phase === BOARD || this.phase === RESULT)) {
      player.send('score', { red: this.keycard.redLeft, blue: this.keycard.blueLeft });
    }
  }

  reconnectSendWinner(player) {
    if (this.phase === RESULT && this.winner !== undefined) {
      player.send('winner', { winner: this.winner });
    }
  }

  reconnectSendStats(player) {
    if (this.phase === RESULT) {
      player.send('stats', { stats: this.gameStats });
    }
  }
}

module.exports = ClassicGame;