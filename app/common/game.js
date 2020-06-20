const GameInterface = require("../game")

class Game extends GameInterface {
  constructor(code, onEmpty, options, broadcast, PlayerListClass, minPlayers) {
    super(code, onEmpty, options, broadcast);

    this.plist = new PlayerListClass(
      () => this.notifyPlayerUpdate(),
      () => this.delete(),
    );
    this.minPlayers = minPlayers;
  }

  reset() {
    this.timer = undefined;
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

  setTeam(name, isRed) {
    this.plist.setTeam(name, isRed);
  }

  randomizeTeams() {
    this.plist.randomizeTeams();
  }

  allAssignedTeam() {
    return this.plist.allAssignedTeam();
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