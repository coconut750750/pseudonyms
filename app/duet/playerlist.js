const _ = require('lodash');
const mongoose = require('mongoose');

const { DuetPlayerSchema, DuetPlayerModel } = require('./player');
const PlayerListInterface = require('../common/playerlist');

class DuetPlayerListSchema extends mongoose.Schema {
  constructor() {
    super();
    mongoose.Schema.apply(this, arguments);
    this.add({
      players: {
        type: Map,
        of: {
          type: DuetPlayerSchema,
          _id : false,
        },
      },
    });
  }
}

class DuetPlayerListClass extends PlayerListInterface {
  constructor() {
    super();
  }

  createPlayer(name, sid) {
    return new DuetPlayerModel(
      name,
      sid,
      this.length() === 0
    )
  }
}

const schema = new DuetPlayerListSchema();
schema.loadClass(DuetPlayerListClass);
const DuetPlayerListModel = mongoose.model(DuetPlayerListClass, schema);

module.exports = {
  DuetPlayerListModel,
  DuetPlayerListSchema: schema,
};