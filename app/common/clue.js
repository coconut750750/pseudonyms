const mongoose = require('mongoose');

class ClueSchema extends mongoose.Schema {
  constructor() {
    super();
    mongoose.Schema.apply(this, arguments);
    this.add({
      word: {type: String, required: true},
      count: {type: Number, required: true},
      team: {type: String, required: true},
    });
  }
}

class Clue extends mongoose.Model {
  constructor(word, count, team) {
    super();
    this.word = word;
    this.count = count;
    this.team = team;
  }

  json() {
    return { word: this.word, count: this.count, team: this.team };
  }
}

const schema = new ClueSchema();
schema.loadClass(Clue);
const ClueModel = mongoose.model(Clue, schema);

module.exports = ClueModel;