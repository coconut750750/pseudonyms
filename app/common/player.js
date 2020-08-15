const mongoose = require('mongoose');

class PlayerSchema extends mongoose.Schema {
  constructor() {
    super();
    mongoose.Schema.apply(this, arguments);
    this.add({
      name: {type: String, required: true},
      sid: {type: String, required: false},
      isAdmin: {type: Boolean, required: true},
      active: {type: Boolean, required: true},
    });
  }
}

class PlayerClass extends mongoose.Model {
  constructor(name, sid, isAdmin) {
    super();
    this.name = name;
    this.sid = sid;
    this.isAdmin = isAdmin;
    this.active = true;
  }

  activate(sid) {
    this.active = true;
    this.sid = sid;
  }

  deactivate() {
    this.active = false;
    this.sid = undefined;
  }

  isOnTeam(team) {
    return this.team === team;
  }

  json() {
    return {
      name: this.name,
      isAdmin: this.isAdmin,
      active: this.active,
    };
  }

  send(event, data, emitter) {
    if (this.sid !== undefined) {
      emitter(this.sid, event, data);
    }
  }
}

module.exports = {
  PlayerClass,
  PlayerSchema,
};