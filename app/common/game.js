const mongoose = require('mongoose');
const { GameInterface, AbstractGameSchema } = require("../game");
const { CluesModel, CluesSchema } = require("../common/clues");
const socketio = require("./socketio");

class GameSchema extends AbstractGameSchema {
  constructor() {
    super(arguments);
    this.add({
      minPlayers: Number,
      clues: {
        type: CluesSchema,
      },
    });
  }
}

class GameClass extends GameInterface {
  constructor() {
    super();
  }

  setup(code, onEmpty, options, broadcast, emitter, PlayerListClass, minPlayers) {
    super.setup(code, onEmpty, options, broadcast, emitter);
    this.clues = new CluesModel( () => this.notifyClue() );

    this.plist = new PlayerListClass(
      () => this.notifyPlayerUpdate(),
      () => this.delete(),
    );
    this.minPlayers = minPlayers;
  }

  mode() {
    throw new Error('Game.mode() implemention required!');
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
    return this.plist.getPlayer(name);
  }

  enoughPlayers() {
    return this.plist.getAll().length >= this.minPlayers;
  }

  playerExists(name) {
    return this.plist.exists(name);
  }

  addPlayer(name, sid) {
    this.plist.add(name, sid);
  }

  activatePlayer(name, sid) {
    this.plist.activate(name, sid);
  }

  deactivatePlayer(name) {
    this.plist.deactivate(name);
  }

  isActive(name) {
    return this.plist.isActive(name);
  }

  canRemove(name) {
    throw new Error('Game.canRemove() implemention required!');
  }

  removePlayer(name) {
    this.plist.removePlayer(name, this.emitter);
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

  notifyClue() {
    this.broadcast('clues', this.clues.json());
  }

  delete() {
    clearInterval(this.timer);
    this.broadcast('end', {});
    this.onEmpty();
  }
}

let schema = new GameSchema();
schema.loadClass(GameClass);
let GameModel = mongoose.model(GameClass, schema, 'games');

module.exports = {
  GameClass,
  GameSchema,
  GameModel,
};
