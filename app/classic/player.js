const mongoose = require('mongoose');

const { RED, BLUE, PLAYER_ROLE, CAPTAIN_ROLE, NO_TEAM } = require('../common/const').classic;
const { PlayerClass, PlayerSchema } = require('../common/player');

class ClassicPlayerSchema extends PlayerSchema {
  constructor() {
    super(arguments);
    this.add({
      team: {
        type: String,
        enum : [RED, BLUE, NO_TEAM],
        default: NO_TEAM,
      },
      role: {
        type: String,
        enum : [PLAYER_ROLE, CAPTAIN_ROLE],
        default: PLAYER_ROLE,
      },
    })
  }
}

class ClassicPlayer extends PlayerClass {
  constructor(name, sid, isAdmin) {
    super(name, sid, isAdmin);

    this.team = NO_TEAM;
    this.role = PLAYER_ROLE;
  }

  setTeam(isRed) {
    this.team = isRed ? RED : BLUE;
  }

  assignedTeam() {
    return this.team !== NO_TEAM;
  }

  resetTeam() {
    this.team = NO_TEAM;
  }

  setCaptain() {
    this.role = CAPTAIN_ROLE;
  }

  isCaptain() {
    return this.role === CAPTAIN_ROLE;
  }

  resetRole() {
    this.role = PLAYER_ROLE;
  }

  json() {
    return {
      ...super.json(),
      team: this.team,
      role: this.role,
    };
  }

  sendAsCaptain(event, data, emitter) {
    if (this.role === CAPTAIN_ROLE) {
      this.send(event, data, emitter);
    }
  }
}

const schema = new ClassicPlayerSchema();
schema.loadClass(ClassicPlayer);
const ClassicPlayerModel = mongoose.model(ClassicPlayer, schema);

module.exports = {
  ClassicPlayerSchema: schema,
  ClassicPlayerModel,
};