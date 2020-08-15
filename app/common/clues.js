const _ = require('lodash');
const mongoose = require('mongoose');

const { ClueModel, ClueSchema } = require('./clue');

class CluesSchema extends mongoose.Schema {
  constructor() {
    super(arguments);
    mongoose.Schema.apply(this, arguments);
    this.add({
      clues: [ClueSchema],
      currentActive: Boolean,
      notifyClue: Object,
    });
  }
}

class Clues extends mongoose.Model {
  constructor() {
    super();
    this.clear();
  }

  setup(notifyClue) {
    this.notifyClue = notifyClue;
  }

  clear() {
    this.clues = [];
    this.currentActive = false;
  }

  length() {
    return this.clues.length;
  }

  add(word, count, team) {
    const clue = new ClueModel(word, count, team);
    this.clues.push(clue);
    this.currentActive = true;
    this.notifyClue();
  }

  getCurrent() {
    return this.currentClue;
  }

  currentExists() {
    return this.currentActive;
  }

  resetCurrent() {
    this.currentActive = false;
  }

  json() {
    const current = this.currentExists() ? this.clues[this.clues.length - 1] : undefined;
    let res = { current: current?.json(), clues: [] };
    for (var clue of this.clues) {
      res.clues.push(clue.json());
    }
    return res;
  }
}

const schema = new CluesSchema();
schema.loadClass(Clues);
const CluesModel = mongoose.model(Clues, schema);

module.exports = {
  CluesModel,
  CluesSchema: schema,
};