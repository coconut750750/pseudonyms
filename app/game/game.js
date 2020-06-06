const GameInterface = require("../game")
const Board = require("./board");
const KeyCard = require("./keycard");
const PlayerList = require("./playerlist");
const Clues = require("./clues");
const WordList = require("./wordlist");
const GameOptions = require("./gameoptions");

const { RED, BLUE, MIN_PLAYERS } = require("./const");

const PHASES = ['lobby', 'teams', 'roles', 'board', 'result'];

class Game extends GameInterface {
  constructor(code, onEmpty, options, broadcast) {
    super(code, onEmpty, options, broadcast);
    this.plist = new PlayerList(
      () => this.notifyPlayerUpdate(),
      () => this.delete(),
    );

    this.clues = new Clues( clue => this.notifyClue(clue) );

    this.broadcastKeys = (event, data) => {
      this.plist.getAll().forEach(p => p.sendAsKey(event, data));
    }

    this.reset();
  }

  reset() {
    this.started = false;
    this.gameoptions = undefined;
    this.phase = PHASES[0];
    this.keycard = undefined;
    this.wordlist = undefined;
    this.board = undefined;
    this.turn = undefined;
    this.guessesLeft = 0;
    this.timer = undefined;
    this.winner = undefined;
    this.clues.clear();

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
    if (!this.enoughPlayers()) {
      throw new Error(`At least ${MIN_PLAYERS} players required to start`);
    }
    this.gameoptions = new GameOptions(options);
    this.wordlist = new WordList(this.gameoptions.wordlist, this.gameoptions.customWords);

    this.started = true;
    this.phase = PHASES[1];
    this.notifyPhaseChange();
  }

  canConfirmTeams() {
    return this.plist.allAssignedTeam();
  }

  confirmTeams() {
    if (!this.canConfirmTeams()) {
      throw new Error("All players must be on a team");
    }
    this.phase = PHASES[2];
    this.notifyPhaseChange();
  }

  canConfirmRoles() {
    return this.plist.enoughKeys();
  }

  confirmRoles() {
    if (!this.canConfirmRoles()) {
      throw new Error("Not enough keys");
    }
    this.phase = PHASES[3];

    this.keycard = new KeyCard();
    this.turn = this.keycard.start;
    this.board = new Board(this.wordlist, (r, c) => this.notifyReveal(r, c));

    this.notifyKeyChange();
    this.notifyBoardChange();
    this.notifyTurnChange();
    this.notifyScore();
    this.notifyPhaseChange();

    this.startClue();
  }

  startTimer(time, timeout) {
    if (time <= 0 || Number.isNaN(time)) {
      return;
    }
    let timeLeft = time;
    this.notifyTime(timeLeft);
    this.timer = setInterval(() => {
      timeLeft--;
      this.notifyTime(timeLeft);
      if (timeLeft === 0) {
        clearInterval(this.timer);
        timeout();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
    this.notifyTime(undefined);
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
    if (!player.isOnTeam(this.turn)) {
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

  validClue(word) {
    return this.board.validWord(word.toLowerCase());
  }

  addClue(word, count) {
    if (!this.validClue(word)) {
      throw new Error("Invalid Clue");
    }
    this.clues.add(word, count, this.turn);
    this.guessesLeft = count + 1;
    this.notifyGuessesLeft();
    this.startGuess();
  }

  isActivePlayer(player) {
    return player.isOnTeam(this.turn) && !player.isKey();
  }

  canReveal(player) {
    return player.isOnTeam(this.turn) && !player.isKey();
  }

  canEndTurn(player) {
    return this.clues.currentExists() && player.isOnTeam(this.turn);
  }

  reveal(r, c) {
    if (this.board.isRevealed(r, c)) {
      return;
    }

    this.board.reveal(r, c);
    this.keycard.reveal(r, c);
    this.guessesLeft -= 1;
    this.notifyScore();
    this.notifyGuessesLeft();

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
    } else if (this.guessesLeft == 0) {
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
    this.clues.resetCurrent();
    this.turn = this.turn === RED ? BLUE : RED;
    this.notifyTurnChange();
    this.startClue();
  }

  endGame(winner) {
    this.stopTimer();
    this.winner = winner;
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

  notifyClue(clue) {
    this.broadcast('clue', clue.json());
  }

  notifyTime(time) {
    this.broadcast('time', { time });
  }

  notifyScore() {
    this.broadcast('score', { red: this.keycard.redLeft, blue: this.keycard.blueLeft });
  }

  notifyReveal(r, c) {
    const color = this.keycard.getTile(r, c);
    this.broadcast('reveal', { reveal: [{ r, c, color }] });
  }

  notifyGuessesLeft() {
    this.broadcast('guesses', { guesses: this.guessesLeft });
  }

  notifyWinner() {
    this.broadcast('winner', { winner: this.winner });
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
    if (this.phase === PHASES[4] || player.isKey()) {
      player.send('key', this.keycard.json());
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

  reconnectSendGuessesLeft(player) {
    if (this.clues.currentExists()) {
      player.send('guesses', { guesses: this.guessesLeft });
    }
  }

  reconnectSendScore(player) {
    if (this.keycard !== undefined && (this.phase === PHASES[3] || this.phase === PHASES[4])) {
      player.send('score', { red: this.keycard.redLeft, blue: this.keycard.blueLeft });
    }
  }

  reconnectSendWinner(player) {
    if (this.phase === 'result' && this.winner !== undefined) {
      player.send('winner', { winner: this.winner });
    }
  }

  delete() {
    clearInterval(this.timer);
    this.broadcast('end', {});
    this.onEmpty();
  }
}

module.exports = Game;