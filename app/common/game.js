const GameInterface = require("../game");
const socketio = require("./socketio");

class Game extends GameInterface {
  constructor(code, onEmpty, options, broadcast, PlayerListClass, minPlayers) {
    super(code, onEmpty, options, broadcast);

    this.plist = new PlayerListClass(
      () => this.notifyPlayerUpdate(),
      () => this.delete(),
    );
    this.minPlayers = minPlayers;
  }

  socketio(socket, game, name, player) {
    socketio(socket, game, name, player);
  }

  reset() {
    this.timer = undefined;
  }

  canReset() {
    throw new Error('Game.canReset() implemention required!');
  }

  getPlayer(name) {
    return this.plist.get(name);
  }

  enoughPlayers() {
    return this.plist.getAll().length >= this.minPlayers;
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
    throw new Error('Game.canSetTeam() implemention required!');
  }

  setTeam(name, isRed) {
    this.plist.setTeam(name, isRed);
  }

  randomizeTeams() {
    this.plist.randomizeTeams();
  }

  allAssignedTeam() {
    return this.plist.allAssignedTeam();
  }

  confirmTeams() {
    if (!this.allAssignedTeam()) {
      throw new Error("All players must be on a team");
    }
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

  canSendClue() {
    throw new Error('Game.canSendClue() implemention required!');
  }
  
  addClue() {
    throw new Error('Game.addClue() implemention required!');
  }
  
  canReveal() {
    throw new Error('Game.canReveal() implemention required!');
  }
  
  reveal() {
    throw new Error('Game.reveal() implemention required!');
  }
  

  canEndTurn() {
    throw new Error('Game.canEndTurn() implemention required!');
  }

  endTurn() {
    throw new Error('Game.endTurn() implemention required!');
  }

  getPlayerData() {
    const players = this.plist.getAll();
    const playerData = { players: players.map(p => p.json()) };
    return playerData;
  }

  notifyPlayerUpdate() {
    this.broadcast('players', this.getPlayerData());
  }

  notifyTime(time) {
    this.broadcast('time', { time });
  }

  delete() {
    clearInterval(this.timer);
    this.broadcast('end', {});
    this.onEmpty();
  }
}

module.exports = Game;