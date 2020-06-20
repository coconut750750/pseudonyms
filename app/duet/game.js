const GameInterface = require("../common/game")
const socketio = require("./socketio");
const Board = require("./board");
const KeyCard = require("./keycard");
const PlayerList = require("./playerlist");
const Clues = require("../common/clues");
const WordList = require("../common/wordlist");
const GameOptions = require("./gameoptions");

const { RED, BLUE, MIN_PLAYERS, DEFAULT_TIMER_TOKENS } = require("../common/const").duet;

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

  name() {
    return "duet";
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
    super.confirmTeams();
    if (!this.validTeamCount()) {
      throw new Error("At least 1 player must be on each team");
    }
    this.startBoard();
  }

  startBoard() {
    this.phase = BOARD;

    this.keycard = new KeyCard();
    this.board = new Board(this.wordlist, (r, c) => this.notifyReveal(r, c));

    this.notifyKeyChange();
    this.notifyBoardChange();
    this.notifyScore();
    this.notifyPhaseChange();

    this.startClue();

    this.notifyPhaseChange();
  }

  startClue() {
    this.stopTimer();
    if (this.turn !== undefined) {
      this.startTimer(this.gameoptions.clueLimit, () => this.addClue(undefined, "-", "-"));
    }
  }

  startGuess() {
    this.stopTimer();
    this.startTimer(this.gameoptions.guessLimit, () => this.endTurn());
  }

  canSendClue(player) {
    if (this.phase !== BOARD) {
      return false;
    }
    return this.turn === undefined || player.isOnTeam(this.turn);
  }

  validClue(word) {
    return this.board.validWord(word.toLowerCase());
  }

  addClue(player, word, count) {
    if (player !== undefined && !this.canSendClue(player)) {
      return;
    }
    if (!this.validClue(word)) {
      throw new Error("Invalid Clue");
    }
    if (this.turn === undefined) {
      this.turn = player.team;
      this.notifyTurnChange();
    }
    this.clues.add(word, count, this.turn);
    this.startGuess();
  }

  canReveal(player) {
    return !player.isOnTeam(this.turn);
  }

  canEndTurn(player) {
    return this.clues.currentExists() && !player.isOnTeam(this.turn);
  }

  reveal(r, c) {
    if (this.board.isRevealed(r, c, this.turn)) {
      return;
    }

    this.keycard.reveal(r, c, this.turn);
    this.notifyScore();

    if (this.keycard.isBlack(r, c, this.team)) {
      this.endGame(false);
    } else if (this.keycard.checkWin()) {
      this.endGame(true);
    } else if (this.keycard.isWhite(r, c, this.team)) {
      this.board.reveal(r, c, this.turn, false);
      this.mistakesLeft -= 1;
      this.endTurn();
    } else { // was green
      this.board.reveal(r, c, this.turn, true);
    }
  }

  getRevealsData() {
    let data = [];
    this.board.revealed.forEach((rev, index) => {
      const [r, c] = this.board.indexToCoord(index);
      const colors = [...rev].map(team => this.keycard.getTile(r, c, team));
      data.push({ r, c, teams: rev, colors: colors });
    });
    return data;
  }

  endTurn() {
    this.clues.resetCurrent();
    this.turn = this.turn === RED ? BLUE : RED;
    this.notifyTurnChange();
    this.startClue();

    this.timersLeft -= 1;
  }

  endGame(win) {
    this.stopTimer();
    this.phase = RESULT;

    this.win = win;
    this.notifyWin();
    this.notifyFinalReveal();
    this.notifyPhaseChange();
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
    this.broadcast('score', { score: this.keycard.leftover, mistakes: this.mistakesLeft, timer: this.timersLeft });
  }

  notifyReveal(r, c) {
    const color = this.keycard.getTile(r, c);
    this.broadcast('reveal', { reveal: [{ r, c, color }] });
  }

  notifyWin() {
    this.broadcast('winner', { win: this.win });
  }

  notifyFinalReveal() {
    this.broadcast('key', this.keycard.json());
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
    player.send('key', this.keycard.json(player.team));
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
      player.send('score', { score: this.keycard.leftover, mistakes: this.mistakesLeft, timer: this.timersLeft });
    }
  }

  reconnectSendWin(player) {
    if (this.phase === RESULT && this.winner !== undefined) {
      player.send('winner', { win: this.win });
    }
  }
}

module.exports = DuetGame;
