var _ = require('lodash');
var Clue = require('./clue');

class Clues {
  constructor(notifyClue) {
    this.notifyClue = notifyClue;
    this.clues = [];
    this.currentClue = undefined;
  }

  add(word, count, team) {
    const clue = new Clue(word, count, team);
    this.clues.push(clue);
    this.notifyClue(clue);
    this.currentClue = clue;
  }

  clear() {
    this.clues = [];
  }

  getCurrent() {
    return this.currentClue;
  }

  currentExists() {
    return this.currentClue !== undefined;
  }

  resetCurrent() {
    this.currentClue = undefined;
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