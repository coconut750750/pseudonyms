const _ = require('lodash');
const mongoose = require('mongoose');

const { ClassicPlayerSchema, ClassicPlayerModel } = require('./player');
const { RED, BLUE } = require('../common/const').classic;
const PlayerListInterface = require('../common/playerlist');

class ClassicPlayerListSchema extends mongoose.Schema {
  constructor() {
    super();
    mongoose.Schema.apply(this, arguments);
    this.add({
      PlayerClass: Object,
      notifyUpdate: Object,
      endGame: Object,
      players: {
        type: Map,
        of: {
          type: ClassicPlayerSchema,
          _id : false,
        },
      },
    });
  }
}

class ClassicPlayerListClass extends PlayerListInterface {
  constructor() {
    super();
  }

  setup(notifyUpdate, endGame) {
    super.setup(ClassicPlayerModel, notifyUpdate, endGame);
  }

  resetRoles() {
    for (let [name, p] of this.players) {
      p.resetRole();
    }
    this.notifyUpdate();
  }

  randomizeCaptain(team) {
    const players = this.getAll().filter(p => p.isOnTeam(team));
    const r = Math.floor(Math.random() * players.length);
    this.setCaptain(players[r].name);
  }

  setCaptain(name) {
    for (let [n, p] of this.players) {
      if (p.isOnTeam(this.players.get(name).team)) {
        p.resetRole();
      }
    }
    this.players.get(name).setCaptain();
    this.notifyUpdate();
  }

  enoughCaptains() {
    let hasRedCaptain = false;
    let hasBlueCaptain = false;

    for (let [name, p] of this.players) {
      hasRedCaptain = hasRedCaptain || (p.isOnTeam(RED) && p.isCaptain());
      hasBlueCaptain = hasBlueCaptain || (p.isOnTeam(BLUE) && p.isCaptain());
    }

    return hasRedCaptain && hasBlueCaptain
  }
}

const schema = new ClassicPlayerListSchema();
schema.loadClass(ClassicPlayerListClass);
const ClassicPlayerListModel = mongoose.model(ClassicPlayerListClass, schema);

module.exports = {
  ClassicPlayerListModel,
  ClassicPlayerListSchema: schema,
};