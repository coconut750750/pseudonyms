var _ = require('lodash');
var Clue = require('./clue');

class Clues {
  constructor(notifyClue) {
    this.notifyClue = notifyClue;
    this.clues = [];
  }

  add(word, count, team) {
    const clue = new Clue(word, count, team);
    this.clue.push[clue];
    this.notifyClue(clue);
  }

  clear() {
    this.clues = [];
  }

  json() {
    let res = { clues: [] };
    for (var clue of this.clues) {
      res.clues.push(clue.json());
    }
    return res;
  }
}

module.exports = Clues;