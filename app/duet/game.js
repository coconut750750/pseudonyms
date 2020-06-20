const GameInterface = require("../common/game")
const Board = require("./board");
const KeyCard = require("./keycard");
const PlayerList = require("./playerlist");
const Clues = require("../common/clues");
const WordList = require("../common/wordlist");
const GameOptions = require("./gameoptions");

const { RED, BLUE, MIN_PLAYERS, MAX_TIMER_TOKENS } = require("../common/const").duet;

const LOBBY = 'lobby';
const TEAMS = 'teams';
const BOARD = 'board';
const RESULT = 'result';

class DuetGame extends GameInterface {
  constructor(code, onEmpty, options, broadcast) {
    super(code, onEmpty, options, broadcast, PlayerList, MIN_PLAYERS);

    this.clues = new Clues( clue => this.notifyClue(clue) );

    // this.broadcastKeys = (event, data) => {
    //   this.plist.getAll().forEach(p => p.sendAsKey(event, data));
    // }

    this.reset();
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
    // if (timers > MAX_TIMER_TOKENS) {
    //   throw new Error(`The maximum number of timer tokens is ${MAX_TIMER_TOKENS}`);
    // }
    // if (mistakes > timers) {
    //   throw new Error(`The number of allowed mistakes can't be more than the number of timer tokens`);
    // }
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

    this.started = true;
    this.phase = TEAMS;
    this.notifyPhaseChange();
  }

  confirmTeams() {
    if (!this.allAssignedTeam()) {
      throw new Error("All players must be on a team");
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
    this.startTimer(this.gameoptions.clueLimit, () => this.addClue("-", "-"));
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
    if (!this.validClue(word)) {
      throw new Error("Invalid Clue");
    }
    if (this.turn === undefined) {
      this.turn = player.team;
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
      this.endTurn();
      this.board.reveal(r, c, this.turn, false);
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
  }

  endGame(win) {
    this.stopTimer();
    this.phase = RESULT;
    this.notifyWin(win);
    this.notifyFinalReveal();
    this.notifyPhaseChange();
  }

  notifyPhaseChange() {
    this.broadcast('phase', { phase: this.phase });
  }

  notifyBoardChange() {
    this.broadcast('board', this.board.json());
  }

  notifyTurnChange() {
    this.broadcast('turn', { turn: this.turn });
  }

  notifyClue(clue) {
    this.broadcast('clue', clue.json());
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

}

module.exports = DuetGame;
