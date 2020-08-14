const mongoose = require('mongoose');

const { RED, BLUE, NO_TEAM } = require('../common/const').duet;
const { PlayerClass, PlayerSchema } = require('../common/player');

class DuetPlayerSchema extends PlayerSchema {
  constructor() {
    super(arguments);
    this.add({
      team: {
        type: String,
        enum : [RED, BLUE, NO_TEAM],
        default: NO_TEAM,
      },
    })
  }
}

class DuetPlayer extends PlayerClass {
  constructor(name, sid, isAdmin) {
    super(name, sid, isAdmin);

    this.team = NO_TEAM;
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

  json() {
    return {
      ...super.json(),
      team: this.team,
    };
  }

  sendAsTeam(team, event, data, emitter) {
    if (this.team === team) {
      this.send(event, data, emitter);
    }
  }
}

const schema = new DuetPlayerSchema();
schema.loadClass(DuetPlayer);
const DuetPlayerModel = mongoose.model(DuetPlayer, schema);

module.exports = DuetPlayerModel;