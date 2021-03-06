var _ = require('lodash');
var Clue = require('./clue');

class Clues {
  constructor(notifyClue) {
    this.notifyClue = notifyClue;
    this.clear();
  }

  clear() {
    this.clues = [];
    this.currentClue = undefined;
  }

  length() {
    return this.clues.length;
  }

  add(word, count, team) {
    const clue = new Clue(word, count, team);
    this.clues.push(clue);
    this.currentClue = clue;
    this.notifyClue();
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
    let res = { current: this.getCurrent()?.json(), clues: [] };
    for (var clue of this.clues) {
      res.clues.push(clue.json());
    }
    return res;
  }
}

module.exports = Clues;