const GameInterface = require("../common/game")
const socketio = require("./socketio");
const Board = require("./board");
const KeyCard = require("./keycard");
const PlayerList = require("./playerlist");
const Clues = require("../common/clues");
const WordList = require("../common/wordlist");
const GameOptions = require("./gameoptions");

const c = require('../common/const');
const { DUET } = c;
const { RED, BLUE, MIN_PLAYERS, FIRST_TURN, SUDDEN_DEATH } = c.duet;

const LOBBY = 'lobby';
const TEAMS = 'teams';
const BOARD = 'board';
const RESULT = 'result';

class DuetGame extends GameInterface {
  constructor(code, onEmpty, options, broadcast) {
    super(code, onEmpty, options, broadcast, PlayerList, MIN_PLAYERS);

    this.clues = new Clues( clue => this.notifyClue(clue) );

    this.broadcastReds = (event, data) => {
      this.plist.getAll().forEach(p => p.sendAsTeam(RED, event, data));
    };

    this.broadcastBlues = (event, data) => {
      this.plist.getAll().forEach(p => p.sendAsTeam(BLUE, event, data));
    };

    this.reset();
  }

  mode() {
    return DUET;
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
    this.win = false;
    this.clues.clear();

    this.timersLeft = 0;
    this.mistakesLeft = 0;

    this.notifyPhaseChange();

    this.plist.resetTeams();
  }

  canReset() {
    return this.phase !== BOARD;
  }

  canStart() {
    return this.phase === LOBBY;
  }

  hasStarted() {
    return this.started;
  }

  canSetTeam() {
    return this.phase === TEAMS;
  }

  start(options) {
    if (!this.enoughPlayers()) {
      throw new Error(`At least ${MIN_PLAYERS} players required to start`);
    }
    
    this.gameoptions = new GameOptions(options);
    this.wordlist = new WordList(this.gameoptions.wordlist, this.gameoptions.customWords);

    this.timersLeft = this.gameoptions.timers;
    this.mistakesLeft = this.gameoptions.mistakes;

    this.started = true;
    this.phase = TEAMS;
    this.notifyPhaseChange();
  }

  validTeamCount() {
    return this.plist.teamCount(RED) >= 1 && this.plist.teamCount(BLUE) >= 1;
  }

  confirmTeams() {
    if (this.phase !== TEAMS) {
      return;
    }
    super.confirmTeams();
    if (!this.validTeamCount()) {
      throw new Error("At least 1 player must be on each team");
    }
    this.startBoard();
  }

  startBoard() {
    this.phase = BOARD;

    this.turn = FIRST_TURN;
    this.keycard = new KeyCard();
    this.board = new Board(this.wordlist, (r, c, team) => this.notifyReveal(r, c, team));

    this.notifyKeyChange();
    this.notifyBoardChange();
    this.notifyTurnChange();
    this.notifyScore();
    this.notifyPhaseChange();

    this.startClue();

    this.notifyPhaseChange();
  }

  startClue() {
    this.stopTimer();
    if (this.turn !== FIRST_TURN) {
      this.startTimer(this.gameoptions.clueLimit, () => this.addClue(undefined, "-", "-"));
    }
  }

  startGuess() {
    this.stopTimer();
    this.startTimer(this.gameoptions.guessLimit, () => this.endTurn());
  }

  canSendClue(player) {
    if (this.phase !== BOARD || !player.assignedTeam()) {
      return false;
    }
    return this.turn === FIRST_TURN || player.isOnTeam(this.turn);
  }

  validClue(word) {
    return this.board.validWord(word.toLowerCase());
  }

  addClue(player, word, count) {
    if (!this.validClue(word)) {
      throw new Error("Invalid Clue");
    }
    if (this.turn === FIRST_TURN) {
      this.turn = player.team;
      this.notifyTurnChange();
    }
    this.clues.add(word, count, this.turn);
    this.startGuess();
  }

  canReveal(player) {
    // during sudden death, clue does not exist, so cannot regularly reveal
    return this.clues.currentExists() && player.assignedTeam() && !player.isOnTeam(this.turn) && this.phase === BOARD;
  }

  canEndTurn(player) {
    return this.canReveal(player) && this.turn !== SUDDEN_DEATH;
  }

  reveal(r, c) {
    if (!this.board.validTile(r, c)) {
      return;
    }
    if (this.board.isRevealed(r, c, this.turn)) {
      return;
    }

    this.board.reveal(r, c, this.turn, this.keycard.isGreen(r, c, this.turn));
    this.keycard.reveal(r, c, this.turn);
    this.notifyScore();

    if (this.keycard.isBlack(r, c, this.turn)) {
      this.endGame(false);
    } else if (this.keycard.checkWin()) {
      this.endGame(true);
    } else if (this.keycard.isWhite(r, c, this.turn)) {
      if (this.mistakesLeft <= 0) {
        this.timersLeft = Math.max(this.timersLeft - 1, 0);
      } else {
        this.mistakesLeft = Math.max(this.mistakesLeft - 1, 0);
      }
      this.endTurn();
    }
  }

  endTurn() {
    this.clues.resetCurrent();
    this.timersLeft = Math.max(this.timersLeft - 1, 0);
    this.notifyScore();

    if (this.timersLeft <= 0) {
      this.turn = SUDDEN_DEATH;
      this.stopTimer();
    } else {
      this.turn = this.turn === RED ? BLUE : RED;
      if (this.keycard.teamFinished(this.turn)) {
        this.turn = this.turn === RED ? BLUE : RED;
      }
      this.startClue();
    }
    this.notifyTurnChange();
  }

  canSuddenDeathReveal(player) {
    return this.phase === BOARD && this.turn === SUDDEN_DEATH && player.assignedTeam();
  }

  suddenDeathReveal(player, r, c) {
    const otherTeam = player.team === RED ? BLUE : RED;
    if (this.board.isRevealed(r, c, otherTeam)) {
      return;
    }

    const isGreen = this.keycard.isGreen(r, c, otherTeam);
    this.board.reveal(r, c, otherTeam, isGreen);
    this.keycard.reveal(r, c, otherTeam);
    this.notifyScore();

    if (!isGreen) {
      this.endGame(false);
    } else if (this.keycard.checkWin()) {
      this.endGame(true);
    }
  }

  endGame(win) {
    this.stopTimer();
    this.phase = RESULT;

    this.win = win;
    this.notifyWin();
    this.notifyFinalReveal();
    this.notifyPhaseChange();
  }

  getRevealsData() {
    let data = [];
    this.board.revealed.forEach((rev) => {
      const { r, c, team } = rev;
      const color = this.keycard.getTile(r, c, team);      
      data.push({ r, c, color, team });
    });
    return data;
  }

  notifyPhaseChange() {
    this.broadcast('phase', { phase: this.phase });
  }

  notifyBoardChange() {
    this.broadcast('board', this.board.json());
  }

  notifyKeyChange() {
    this.broadcastReds('key', this.keycard.json(RED));
    this.broadcastBlues('key', this.keycard.json(BLUE));
  }

  notifyTurnChange() {
    this.broadcast('turn', { turn: this.turn });
  }

  notifyClue(clue) {
    this.broadcast('clue', clue.json());
  }

  notifyScore() {
    this.broadcast('score', { leftover: this.keycard.leftover, mistakes: this.mistakesLeft, timer: this.timersLeft });
  }

  notifyReveal(r, c, team) {
    const color = this.keycard.getTile(r, c, team);
    this.broadcast('reveal', { reveal: [{ r, c, color, team }] });
  }

  notifyWin() {
    this.broadcast('winner', { winner: this.win });
  }

  notifyFinalReveal() {
    this.broadcast('key', this.keycard.jsonMerged());
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
    if (this.phase === RESULT) {
      player.send('key', this.keycard.jsonMerged());
    } else if (player.assignedTeam()) {
      player.send('key', this.keycard.json(player.team));
    }
  }

  reconnectSendTurn(player) {
    if (this.turn !== undefined) {
      player.send('turn', { turn: this.turn });
    }
  }

  reconnectSendClue(player) {
    if (this.clues.currentExists()) {
      player.send('clue', this.clues.getCurrent().json());
    }
  }

  reconnectSendScore(player) {
    if (this.keycard !== undefined && (this.phase === BOARD || this.phase === RESULT)) {
      player.send('score', { leftover: this.keycard.leftover, mistakes: this.mistakesLeft, timer: this.timersLeft });
    }
  }

  reconnectSendWin(player) {
    if (this.phase === RESULT && this.winner !== undefined) {
      player.send('winner', { winner: this.win });
    }
  }
}

module.exports = DuetGame;
