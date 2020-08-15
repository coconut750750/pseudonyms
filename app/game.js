const mongoose = require('mongoose');

class AbstractGameSchema extends mongoose.Schema {
  constructor() {
    super();
    mongoose.Schema.apply(this, arguments);
    this.add({
      code: {type: String, required: true},
    });
  }
}

class GameInterface extends mongoose.Model {
  constructor() {
    super();
  }

  setup(code, onEmpty, options, broadcast, emitter) {
    this.code = code;
    this.onEmpty = onEmpty;
    this.options = options;
    this.broadcast = broadcast;
    this.emitter = emitter;
  }

  playerExists(name) {
    throw new Error('Game.playerExists() implemention required!');
  }

  getPlayer(name) {
    // the object returned will be the object the server will pass into socketio
    throw new Error('Game.getPlayer() implemention required!');
  }

  addPlayer(name, sid) {
    throw new Error('Game.addPlayer() implemention required!');
  }

  removePlayer(name) {
    throw new Error('Game.removePlayer() implemention required!');
  }

  isActive(name) {
    throw new Error('Game.isActive() implemention required!');
  }

  activatePlayer(name, sid) {
    throw new Error('Game.activatePlayer() implemention required!');
  }

  deactivatePlayer(name) {
    throw new Error('Game.deactivatePlayer() implemention required!');
  }

  canStart() {
    throw new Error('Game.canStart() implemention required!');
  }

  hasStarted() {
    // prevents existing users from completely being removed
    throw new Error('Game.hasStarted() implemention required!');
  }

  start() {
    throw new Error('Game.start() implemention required!');
  }

  delete() {
    throw new Error('Game.delete() implemention required!');
  }
}

module.exports = {
  GameInterface,
  AbstractGameSchema,
};